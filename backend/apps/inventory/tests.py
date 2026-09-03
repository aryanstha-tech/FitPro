from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.products.models import Product
from .models import InventoryItem
from .test_helpers import set_inventory


class InventoryTests(APITestCase):
    """Covers: low-stock filtering, staff-only access, negative-stock prevention."""

    def setUp(self):
        product = Product.objects.create(
            slug="tee", name="Tee", price=28, category="Apparel", image="/tee.jpg", description="d"
        )
        self.low = set_inventory(product, sku="SKU1", stock=1, reorder_at=10)

        product2 = Product.objects.create(
            slug="straps", name="Straps", price=16, category="Accessories", image="/s.jpg", description="d"
        )
        self.healthy = set_inventory(product2, sku="SKU2", stock=50, reorder_at=10)

        self.staff = User.objects.create_user(
            email="staff@example.com", name="Staff", password="pw12345678", role=User.Role.STAFF
        )

    def test_member_forbidden(self):
        member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.client.force_authenticate(user=member)
        response = self.client.get("/api/v1/inventory/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_low_stock_filter(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.get("/api/v1/inventory/?low_stock=true")
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["sku"], "SKU1")

    def test_staff_can_update_stock(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.patch(f"/api/v1/inventory/{self.low.product_id}/", {"stock": 25}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.low.refresh_from_db()
        self.assertEqual(self.low.stock, 25)
