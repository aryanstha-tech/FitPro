from django.db import models


class Product(models.Model):
    """Matches the Product TS interface in frontend/lib/mock-data.ts."""

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=100)
    image = models.CharField(max_length=300, help_text="Path or URL to product image.")
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name

    @property
    def in_stock(self) -> bool:
        inventory = getattr(self, "inventory", None)
        return bool(inventory and inventory.stock > 0)
