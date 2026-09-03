from django.db import models
from django.db.models import Q, F, CheckConstraint

from apps.products.models import Product


class InventoryItem(models.Model):
    """Matches the InventoryItem TS interface in frontend/lib/mock-data.ts."""

    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name="inventory")
    sku = models.CharField(max_length=50, unique=True)
    stock = models.PositiveIntegerField(default=0)
    reorder_at = models.PositiveIntegerField(default=10)

    class Meta:
        ordering = ["sku"]
        constraints = [
            # Enforced at the DB level — negative stock is impossible even
            # if application code has a bug, per the plan's testing list
            # ("Negative stock prevention").
            CheckConstraint(condition=Q(stock__gte=0), name="inventory_stock_gte_0"),
        ]

    def __str__(self):
        return f"{self.sku} ({self.stock} in stock)"
