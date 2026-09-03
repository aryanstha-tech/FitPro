"""
Shared test helper — since apps.inventory.signals now auto-creates an
InventoryItem whenever a Product is saved, tests that want specific
stock/sku/reorder_at values should adjust the auto-created row instead
of calling InventoryItem.objects.create() again, which would collide on
the OneToOne constraint.
"""

from .models import InventoryItem


def set_inventory(product, *, sku=None, stock=0, reorder_at=10) -> InventoryItem:
    item = product.inventory
    item.sku = sku or item.sku
    item.stock = stock
    item.reorder_at = reorder_at
    item.save(update_fields=["sku", "stock", "reorder_at"])
    return item
