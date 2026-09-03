from django.conf import settings
from django.db import models


class Order(models.Model):
    """Matches the Order TS interface in frontend/lib/mock-data.ts."""

    class Status(models.TextChoices):
        PROCESSING = "processing", "Processing"
        DELIVERED = "delivered", "Delivered"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PROCESSING)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    # Prevents duplicate order creation on client retry (e.g. double-click,
    # network retry) — same key returns the original order instead of a
    # second one, per the plan's "Duplicate payment prevention" test.
    idempotency_key = models.CharField(max_length=100, unique=True, null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} ({self.user.email})"

    @property
    def items_summary(self) -> str:
        parts = []
        for item in self.items.select_related("product").all():
            label = item.product.name
            parts.append(f"{label} ×{item.quantity}" if item.quantity > 1 else label)
        return ", ".join(parts)


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=8, decimal_places=2)
