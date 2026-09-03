from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, permissions, mixins
from rest_framework.response import Response

from apps.accounts.permissions import IsStaffOrAdmin
from .models import Order
from .serializers import OrderSerializer, CreateOrderSerializer, UpdateOrderStatusSerializer
from .services import create_order


class MyOrdersViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """GET /api/v1/orders/me/ — the authenticated user's own orders."""

    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items__product")


class OrderViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    /api/v1/orders/
    POST                — create an order (any authenticated member)
    GET (list/retrieve) — staff/admin only, all orders, filter by ?status=
    PATCH               — staff/admin only, update status

    One viewset (not split by permission) so a single URL prefix routes
    correctly regardless of HTTP method — a router can't cleanly dispatch
    the same path prefix across two separately-registered viewsets.
    """

    queryset = Order.objects.select_related("user").prefetch_related("items__product")
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateOrderSerializer
        if self.action in ("update", "partial_update"):
            return UpdateOrderStatusSerializer
        return OrderSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated()]
        return [IsStaffOrAdmin()]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = create_order(
            user=request.user,
            items=serializer.validated_data["items"],
            idempotency_key=serializer.validated_data.get("idempotencyKey"),
        )
        return Response(OrderSerializer(order).data, status=201)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=kwargs.get("partial", False))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(OrderSerializer(instance).data)
