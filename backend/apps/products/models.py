from django.db import models


class Product(models.Model):
    """Matches the Product TS interface in frontend/lib/mock-data.ts."""

    slug = models.SlugField(unique=True)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    class Category(models.TextChoices):
        APPAREL = "Apparel", "Apparel"
        EQUIPMENT = "Equipment", "Equipment"
        NUTRITION = "Nutrition", "Nutrition"
        ACCESSORIES = "Accessories", "Accessories"

    category = models.CharField(
        max_length=20,
        choices=Category.choices,
    )
    image = models.ImageField(
    upload_to="products/",
    blank=True,
    )
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
