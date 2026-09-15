"""
Order creation service — kept out of views.py so the transaction/locking
logic has one place to live and is easy to unit test in isolation.

Two order "kinds" share this same create/verify pipeline:
  - Product orders (create_order): items + stock decrement, no package.
  - Membership orders (create_package_order): a package, no items/stock.
Exactly one payment pipeline, one verify step — not two payment systems.

PAYMENT status vs ORDER status are different concepts here:
  - Order.status IS the operational source of truth for "what should
    happen next" (see _finalize_paid_order) — pending_payment,
    processing, completed, delivered, cancelled.
  - apps.payments.Payment is a separate ledger row, one per Order,
    created here and updated at these exact same points — NOT
    independently re-derived business logic. It exists purely for
    admin visibility/audit history (who paid, how, when, what
    reference) — Order.status remains what actually drives behavior.
"""

from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError
from apps.memberships.services import activate_membership
from apps.inventory.models import InventoryItem
from apps.payments.models import Payment
from apps.payments.providers import get_payment_provider
from .models import Order, OrderItem
from apps.payments.providers import (
    PaymentVerificationStatus,
    get_payment_provider,
)

class OutOfStockError(ValidationError):
    status_code = 409


def _create_pending_payment(*, order: Order, user, amount, provider, result) -> None:
    """
    One Payment ledger row per Order, created right after the gateway
    call. status mirrors what we know at THIS moment: PENDING if Khalti
    needs a redirect (not actually paid yet), PAID if the gateway
    resolved immediately (Mock).
    """
    Payment.objects.create(
        order=order,
        user=user,
        amount=amount,
        method=provider.name,
        reference=result.reference,
        status=Payment.Status.PENDING if result.redirect_url else Payment.Status.PAID,
        verified_at=None if result.redirect_url else timezone.now(),
    )


def _finalize_paid_order(order: Order) -> None:
    """
    Called exactly once, at the moment an order's payment is confirmed —
    either immediately (MockPaymentProvider resolves synchronously) or
    after Khalti's lookup confirms Completed (verify_order_payment).

    This is the ONE place "payment confirmed" turns into the correct next
    ORDER status, the Payment ledger row is marked PAID, and a membership
    gets activated if applicable. No admin click is needed for the
    payment->fulfillment-start transition:
      - Membership order  -> activate the membership, order = COMPLETED
        (a membership purchase has nothing further to fulfill).
      - Product order     -> order = PROCESSING (admin still needs to
        prepare/ship it — the only remaining manual step is later
        clicking "Mark as delivered").

    Callers must only invoke this once the payment is GENUINELY
    confirmed — never speculatively.
    """
    if order.package_id:
        activate_membership(user=order.user, package=order.package)
        order.status = Order.Status.COMPLETED
    else:
        order.status = Order.Status.PROCESSING
    order.save(update_fields=["status"])

    Payment.objects.filter(order=order).update(status=Payment.Status.PAID, verified_at=timezone.now())


def create_order(*, user, items: list[dict], idempotency_key: str | None = None) -> tuple[Order, str | None]:
    """
    items: [{"productId": int, "quantity": int}, ...]

    Returns (order, redirect_url). redirect_url is None for a gateway that
    resolves immediately (MockPaymentProvider) — in that case the order is
    already finalized (status=PROCESSING) by the time this returns. When
    redirect_url IS set (Khalti), the order is left in PENDING_PAYMENT and
    the caller MUST send the browser to redirect_url — the order is not
    paid yet, and won't be finalized until verify_order_payment() confirms
    it later.

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
        order.save(update_fields=["payment_reference"])
        _create_pending_payment(order=order, user=user, amount=total, provider=provider, result=result)

        if result.redirect_url:
            order.status = Order.Status.PENDING_PAYMENT
            order.save(update_fields=["status"])
        else:
            _finalize_paid_order(order)  # Mock resolved instantly — finalize now
        return order, result.redirect_url


def create_package_order(*, user, package_id: int, idempotency_key: str | None = None) -> tuple[Order, str | None]:
    """
    Membership purchase — mirrors create_order()'s shape exactly (same
    idempotency check, same payment pipeline, same return signature) but
    with no items/stock: total is the package price.
    """
    from apps.memberships.models import Package

    if idempotency_key:
        existing = Order.objects.filter(idempotency_key=idempotency_key).first()
        if existing:
            return existing, None

    package = Package.objects.filter(id=package_id, is_active=True).first()
    if not package:
        raise ValidationError({"packageId": ["Invalid package."]})

    with transaction.atomic():
        order = Order.objects.create(
            user=user, total=package.price, package=package, idempotency_key=idempotency_key or None
        )

        provider = get_payment_provider()
        result = provider.create_intent(
            amount=package.price,
            currency="npr",
            idempotency_key=idempotency_key,
            purchase_order_id=str(order.id),
            purchase_order_name=f"FitPro membership: {package.name}",
            customer_info={"name": user.name, "email": user.email, "phone": user.phone},
        )
        if not result.success:
            raise ValidationError({"payment": ["Payment failed."]})

        order.payment_reference = result.reference
        order.save(update_fields=["payment_reference"])
        _create_pending_payment(
            order=order, user=user, amount=package.price, provider=provider, result=result
        )

        if result.redirect_url:
            order.status = Order.Status.PENDING_PAYMENT
            order.save(update_fields=["status"])
        else:
            _finalize_paid_order(order)  # Mock resolved instantly — activate + finalize now
        return order, result.redirect_url


def verify_order_payment(order: Order) -> Order:
    """
    Called after the user returns from Khalti's redirect. Looks the
    payment up with the gateway (never trusts the redirect's own query
    params, per Khalti's own docs: "use the lookup API for final
    validation") and finalizes or releases the order accordingly.

    Idempotent by construction: if the order isn't PENDING_PAYMENT
    anymore (already finalized OR already cancelled by a prior call),
    this returns immediately — a duplicate verification request (Test 10)
    cannot re-activate a membership, re-finalize an order, re-mark the
    Payment row, or re-release stock, since none of that code runs a
    second time.
    """
    if order.status != Order.Status.PENDING_PAYMENT:
        return order

    provider = get_payment_provider()

    verification_status = provider.verify(order.payment_reference)

    if verification_status == PaymentVerificationStatus.COMPLETED:
        _finalize_paid_order(order)
        return order

    if verification_status == PaymentVerificationStatus.PENDING:
        return order

    # Only FAILED reaches this point.
    with transaction.atomic():
        for item in order.items.select_related("product"):
            inventory = InventoryItem.objects.select_for_update().get(
                product=item.product
            )
            inventory.stock += item.quantity
            inventory.save(update_fields=["stock"])

        order.status = Order.Status.CANCELLED
        order.save(update_fields=["status"])

        Payment.objects.filter(order=order).update(
            status=Payment.Status.FAILED
        )

    return order
