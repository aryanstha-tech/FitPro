from datetime import date
from dateutil.relativedelta import relativedelta

from django.db.models import Sum, Count
from django.db.models.functions import TruncMonth
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsStaffOrAdmin
from apps.memberships.models import Membership
from apps.orders.models import Order
from apps.inventory.models import InventoryItem
from django.db.models import F


class DashboardSummaryView(APIView):
    """GET /api/v1/dashboard/summary/ — backs the admin overview stat cards."""

    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        today = date.today()
        active_members = Membership.objects.filter(status="active").values("user").distinct().count()
        orders_this_month = Order.objects.filter(
            created_at__year=today.year, created_at__month=today.month
        ).count()
        low_stock_count = InventoryItem.objects.filter(stock__lte=F("reorder_at")).count()
        month_revenue = (
            Order.objects.filter(created_at__year=today.year, created_at__month=today.month).aggregate(
                total=Sum("total")
            )["total"]
            or 0
        )
        return Response(
            {
                "activeMembers": active_members,
                "ordersThisMonth": orders_this_month,
                "lowStockCount": low_stock_count,
                "monthRevenue": month_revenue,
            }
        )


class DashboardRevenueView(APIView):
    """GET /api/v1/dashboard/revenue/?months=6 — backs RevenueChart."""

    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        months = int(request.query_params.get("months", 6))
        start = date.today().replace(day=1) - relativedelta(months=months - 1)
        rows = (
            Order.objects.filter(created_at__date__gte=start)
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(revenue=Sum("total"))
            .order_by("month")
        )
        return Response([{"month": r["month"].strftime("%b"), "revenue": r["revenue"]} for r in rows])


class MembershipMixView(APIView):
    """GET /api/v1/dashboard/membership-mix/ — backs the Analytics page breakdown."""

    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        rows = (
            Membership.objects.filter(status="active")
            .values("package__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return Response([{"plan": r["package__name"], "count": r["count"]} for r in rows])
