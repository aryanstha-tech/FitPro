from datetime import date, timedelta

from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.memberships.models import Package, Membership
from apps.orders.services import create_order
from apps.products.models import Product
from apps.inventory.test_helpers import set_inventory


class DashboardAnalyticsTests(APITestCase):
    """Covers: Analytics calculations (Phase 9 list)."""

    def setUp(self):
        self.staff = User.objects.create_user(
            email="staff@example.com", name="Staff", password="pw12345678", role=User.Role.STAFF
        )
        self.member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")

        pro = Package.objects.create(name="Pro", price=59, billing="month", perks=[])
        Membership.objects.create(
            user=self.member, package=pro, status="active", renews_on=date.today() + timedelta(days=30)
        )

        product = Product.objects.create(
            slug="tee", name="Tee", price=28, category="Apparel", image="/t.jpg", description="d"
        )
        set_inventory(product, sku="SKU1", stock=5, reorder_at=10)  # low stock
        create_order(user=self.member, items=[{"productId": product.id, "quantity": 1}])

        self.client.force_authenticate(user=self.staff)

    def test_member_forbidden_from_dashboard_endpoints(self):
        self.client.force_authenticate(user=self.member)
        for url in ["/api/v1/dashboard/summary/", "/api/v1/dashboard/revenue/", "/api/v1/dashboard/membership-mix/"]:
            self.assertEqual(self.client.get(url).status_code, status.HTTP_403_FORBIDDEN)

    def test_summary_reflects_seeded_data(self):
        response = self.client.get("/api/v1/dashboard/summary/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["activeMembers"], 1)
        self.assertEqual(response.data["ordersThisMonth"], 1)
        self.assertEqual(response.data["lowStockCount"], 1)
        self.assertEqual(float(response.data["monthRevenue"]), 28.0)

    def test_membership_mix_reflects_active_packages(self):
        response = self.client.get("/api/v1/dashboard/membership-mix/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [{"plan": "Pro", "count": 1}])

    def test_revenue_endpoint_returns_current_month(self):
        response = self.client.get("/api/v1/dashboard/revenue/?months=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(float(response.data[0]["revenue"]), 28.0)
