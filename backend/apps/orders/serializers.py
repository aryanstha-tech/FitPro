from rest_framework import serializers
from .models import Order, OrderItem


class OrderSerializer(serializers.ModelSerializer):
    """Matches the Order TS interface: {id, date, items, total, status}."""

    date = serializers.DateTimeField(source="created_at", format="%b %-d, %Y", read_only=True)
    items = serializers.CharField(source="items_summary", read_only=True)

    class Meta:
        model = Order
        fields = ["id", "date", "items", "total", "status"]
        read_only_fields = fields


class UpdateOrderStatusSerializer(serializers.ModelSerializer):
    """Separate from OrderSerializer (which is read-only) — this is the
    only path that should be able to write to an Order."""

    class Meta:
        model = Order
        fields = ["status"]


class OrderItemInputSerializer(serializers.Serializer):
    productId = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class CreateOrderSerializer(serializers.Serializer):
    items = OrderItemInputSerializer(many=True)
    idempotencyKey = serializers.CharField(required=False, allow_blank=True)
