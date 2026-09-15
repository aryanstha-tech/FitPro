from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "user",
        "amount",
        "method",
        "status",
        "reference",
        "verified_at",
        "created_at",
    )

    list_filter = (
        "status",
        "method",
        "created_at",
    )

    search_fields = (
        "reference",
        "user__email",
        "user__name",
        "order__id",
    )

    readonly_fields = (
        "order",
        "user",
        "amount",
        "method",
        "reference",
        "created_at",
        "verified_at",
    )