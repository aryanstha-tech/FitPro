from django.conf import settings
from django.db import models


class Payment(models.Model):
    """
    A payment ledger record — one per Order, created at order-creation
    time and updated at the exact same moments orders/services.py updates
    the Order itself (never independently). This exists for admin
    visibility/audit history; it is NOT re-derived business logic that
    could drift from Order — Order.status remains the operational source
    of truth for "what should happen next" (see
    apps.orders.services._finalize_paid_order), and Payment simply
    records what happened, when, and via which gateway.
    """

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        PAID = "paid", "Paid"
        FAILED = "failed", "Failed"

    order = models.OneToOneField("orders.Order", on_delete=models.CASCADE, related_name="payment")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    # "khalti" or "mock" — set from the provider's own `.name` attribute
    # (apps.payments.providers), never string-guessed from the reference.
    method = models.CharField(max_length=20)
    reference = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Payment for Order #{self.order_id} ({self.status})"