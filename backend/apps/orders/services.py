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


def create_order(*, user, items: list[dict], idempotency_key: str | None = None) -> tuple[Order, str | None]:
    """
    items: [{"productId": int, "quantity": int}, ...]

    Returns (order, redirect_url). redirect_url is None for a gateway that
    resolves immediately (MockPaymentProvider); when it's set (Khalti),
    the order is left in PENDING_PAYMENT and the caller MUST send the
    browser to redirect_url — the order is not actually paid yet.

    - Idempotent: replaying the same idempotency_key returns the original
      order rather than creating a second one (duplicate-payment
      prevention).
    - Stock decrement happens inside the same transaction, using
      select_for_update to avoid a race between two concurrent orders for
      the same product ("Negative stock prevention" from the test list) —
      the DB CheckConstraint on InventoryItem.stock is the final backstop.
      Stock is reserved immediately even for a pending Khalti payment;
      verify_order_payment() releases it back if the payment doesn't
      complete.
    """
    if idempotency_key:
        existing = Order.objects.filter(idempotency_key=idempotency_key).first()
        if existing:
            return existing, None

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

        # Charge via the payment abstraction — Mock resolves immediately;
        # Khalti only *starts* the payment and returns a redirect_url.
        # A failed/rejected charge rolls back the whole transaction,
        # including the stock decrement above.
        provider = get_payment_provider()
        result = provider.create_intent(
            amount=total,
            currency="npr",
            idempotency_key=idempotency_key,
            purchase_order_id=str(order.id),
            purchase_order_name=f"FitPro order #{order.id}",
            customer_info={"name": user.name, "email": user.email, "phone": user.phone},
        )
        if not result.success:
            raise ValidationError({"payment": ["Payment failed."]})

        order.payment_reference = result.reference
        if result.redirect_url:
            order.status = Order.Status.PENDING_PAYMENT
        order.save(update_fields=["payment_reference", "status"])

        return order, result.redirect_url


def verify_order_payment(order: Order) -> Order:
    """
    Called after the user returns from Khalti's redirect. Looks the
    payment up with the gateway (never trusts the redirect's own query
    params, per Khalti's own docs: "use the lookup API for final
    validation") and finalizes or releases the order accordingly.

    Safe to call more than once — if the order isn't PENDING_PAYMENT
    anymore, there's nothing left to verify.
    """
    if order.status != Order.Status.PENDING_PAYMENT:
        return order

    provider = get_payment_provider()
    if provider.verify(order.payment_reference):
        order.status = Order.Status.PROCESSING
        order.save(update_fields=["status"])
        return order

    # Payment didn't complete (cancelled, expired, still pending on
    # Khalti's side) — release the reserved stock rather than leaving it
    # locked up by an order that will never be paid.
    with transaction.atomic():
        for item in order.items.select_related("product"):
            inventory = InventoryItem.objects.select_for_update().get(product=item.product)
            inventory.stock += item.quantity
            inventory.save(update_fields=["stock"])
        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])
    return order