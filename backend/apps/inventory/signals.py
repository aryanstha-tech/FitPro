"""
Auto-provisions an InventoryItem whenever a Product is created, so a
newly-added product immediately shows up on the Inventory page (at 0
stock) instead of being invisible until someone remembers to create its
inventory row by hand. Staff then set real stock via the existing
PATCH /api/v1/inventory/{productId}/ endpoint.
"""

import uuid

from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.products.models import Product
from .models import InventoryItem


@receiver(post_save, sender=Product)
def create_inventory_for_new_product(sender, instance, created, **kwargs):
    if not created:
        return
    InventoryItem.objects.get_or_create(
        product=instance,
        defaults={"sku": f"SKU-{uuid.uuid4().hex[:8].upper()}", "stock": 0, "reorder_at": 10},
    )
