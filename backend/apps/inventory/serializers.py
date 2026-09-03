from rest_framework import serializers
from .models import InventoryItem


class InventoryItemSerializer(serializers.ModelSerializer):
    productId = serializers.PrimaryKeyRelatedField(source="product", read_only=True)
    name = serializers.CharField(source="product.name", read_only=True)
    reorderAt = serializers.IntegerField(source="reorder_at")

    class Meta:
        model = InventoryItem
        fields = ["productId", "name", "sku", "stock", "reorderAt"]
        read_only_fields = ["productId", "name", "sku"]
