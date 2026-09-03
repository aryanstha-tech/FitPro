from django.urls import path
from .views import DashboardSummaryView, DashboardRevenueView, MembershipMixView

urlpatterns = [
    path("dashboard/summary/", DashboardSummaryView.as_view(), name="dashboard-summary"),
    path("dashboard/revenue/", DashboardRevenueView.as_view(), name="dashboard-revenue"),
    path("dashboard/membership-mix/", MembershipMixView.as_view(), name="dashboard-membership-mix"),
]
