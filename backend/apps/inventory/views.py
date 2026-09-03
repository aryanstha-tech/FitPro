from rest_framework import viewsets, mixins
from django.db.models import F

from apps.accounts.permissions import IsStaffOrAdmin
from .models import InventoryItem
from .serializers import InventoryItemSerializer


class InventoryViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    """
    Staff/admin only. /api/v1/inventory/
    ?low_stock=true filters to stock <= reorder_at.
    """

    queryset = InventoryItem.objects.select_related("product")
    serializer_class = InventoryItemSerializer
    permission_classes = [IsStaffOrAdmin]
    lookup_field = "product_id"
    lookup_url_kwarg = "productId"

    def get_queryset(self):
        qs = super().get_queryset()
        if self.request.query_params.get("low_stock") == "true":
            qs = qs.filter(stock__lte=F("reorder_at"))
        return qs
