from django.contrib import admin

from .models import Order, OrderItem


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "order_type",
        "get_items_summary",
        "total",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "user__email",
        "user__name",
        "payment_reference",
    )

    readonly_fields = (
        "created_at",
        "payment_reference",
        "get_items_summary",
    )

    @admin.display(description="Type")
    def order_type(self, obj):
        return "Membership" if obj.package_id else "Product"

    @admin.display(description="Items")
    def get_items_summary(self, obj):
        return obj.items_summary


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product",
        "quantity",
        "unit_price",
    )

    search_fields = (
        "order__id",
        "product__name",
    )