from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, filters

from apps.accounts.permissions import IsAdmin
from .models import Product
from .serializers import ProductSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET is public; writes are admin-only.
    /api/v1/products/  — lookup by slug (matches app/shop/[slug])
    """

    queryset = Product.objects.filter(is_active=True).select_related("inventory")
    serializer_class = ProductSerializer
    lookup_field = "slug"
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category"]
    search_fields = ["name", "description"]

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def get_queryset(self):
        qs = super().get_queryset()
        in_stock = self.request.query_params.get("in_stock")
        if in_stock == "true":
            qs = qs.filter(inventory__stock__gt=0)
        return qs
