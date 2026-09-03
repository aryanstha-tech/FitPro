"""
Order creation service — kept out of views.py so the transaction/locking
logic has one place to live and is easy to unit test in isolation.
"""

from django.db import transaction
from rest_framework.exceptions import ValidationError

from apps.inventory.models import InventoryItem
from apps.payments.providers import get_payment_provider
from .models import Order, OrderItem


class OutOfStockError(ValidationError):
    status_code = 409


def create_order(*, user, items: list[dict], idempotency_key: str | None = None) -> Order:
    """
    items: [{"productId": int, "quantity": int}, ...]

    - Idempotent: replaying the same idempotency_key returns the original
      order rather than creating a second one (duplicate-payment
      prevention).
    - Stock decrement happens inside the same transaction, using
      select_for_update to avoid a race between two concurrent orders for
      the same product ("Negative stock prevention" from the test list) —
      the DB CheckConstraint on InventoryItem.stock is the final backstop.
    """
    if idempotency_key:
        existing = Order.objects.filter(idempotency_key=idempotency_key).first()
        if existing:
            return existing

    with transaction.atomic():
        total = 0
        order = Order.objects.create(user=user, total=0, idempotency_key=idempotency_key or None)

        for entry in items:
            inventory = (
                InventoryItem.objects.select_for_update()
                .select_related("product")
                .get(product_id=entry["productId"])
            )
            quantity = entry["quantity"]
            if inventory.stock < quantity:
                raise OutOfStockError(
                    {"items": [f"'{inventory.product.name}' has only {inventory.stock} in stock."]}
                )

            inventory.stock -= quantity
            inventory.save(update_fields=["stock"])  # DB CheckConstraint guards stock >= 0

            unit_price = inventory.product.price
            OrderItem.objects.create(
                order=order, product=inventory.product, quantity=quantity, unit_price=unit_price
            )
            total += unit_price * quantity

        order.total = total
        order.save(update_fields=["total"])

        # Charge via the payment abstraction — Mock today, Real once
        # Developer 1 ships it. A failed charge rolls back the whole
        # transaction, including the stock decrement above.
        provider = get_payment_provider()
        result = provider.create_intent(amount=total, currency="usd", idempotency_key=idempotency_key)
        if not result.success:
            raise ValidationError({"payment": ["Payment failed."]})

        return order
