from rest_framework import serializers
from .models import Order, OrderItem


class OrderSerializer(serializers.ModelSerializer):
    """Matches the Order TS interface: {id, date, items, total, status}.
    Extra fields (customerName/customerEmail/paymentReference/packageName)
    are additive — existing consumers (a member's own order history) just
    ignore the ones they don't display; the admin Orders/Payments pages
    are what actually need them."""

    date = serializers.DateTimeField(source="created_at", format="%b %-d, %Y", read_only=True)
    items = serializers.CharField(source="items_summary", read_only=True)
    customerName = serializers.CharField(source="user.name", read_only=True)
    customerEmail = serializers.CharField(source="user.email", read_only=True)
    paymentReference = serializers.CharField(source="payment_reference", read_only=True, allow_null=True)
    paymentMethod = serializers.SerializerMethodField()
    paymentStatus = serializers.SerializerMethodField()
    packageName = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id",
            "date",
            "items",
            "total",
            "status",
            "customerName",
            "customerEmail",
            "paymentReference",
            "paymentStatus",
            "paymentMethod",
            "packageName",
        ]
        read_only_fields = fields

    def get_paymentMethod(self, obj):
        payment = getattr(obj, "payment", None)
        return payment.method if payment else None

    def get_paymentStatus(self, obj):
        payment = getattr(obj, "payment", None)
        return payment.status if payment else None

    def get_packageName(self, obj):
        return obj.package.name if obj.package_id else None


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
    """
    Accepts EITHER a product order (`items`) OR a membership purchase
    (`packageId`) — never both, never neither. One endpoint, one
    serializer, reused for both order kinds rather than a second
    membership-purchase API.
    """

    items = OrderItemInputSerializer(many=True, required=False)
    packageId = serializers.IntegerField(required=False)
    idempotencyKey = serializers.CharField(required=False, allow_blank=True)

    def validate(self, data):
        has_items = bool(data.get("items"))
        has_package = "packageId" in data
        if has_items and has_package:
            raise serializers.ValidationError("Provide either items or packageId, not both.")
        if not has_items and not has_package:
            raise serializers.ValidationError("Provide either items or packageId.")
        return data