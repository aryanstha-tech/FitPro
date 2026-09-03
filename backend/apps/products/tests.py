from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.inventory.test_helpers import set_inventory
from .models import Product


class ProductTests(APITestCase):
    """Covers: API validation, filtering/search, permissions on writes."""

    def setUp(self):
        self.tee = Product.objects.create(
            slug="tee", name="Training Tee", price=28, category="Apparel", image="/tee.jpg", description="d"
        )
        set_inventory(self.tee, sku="SKU1", stock=10, reorder_at=2)

        self.protein = Product.objects.create(
            slug="protein", name="Whey Protein", price=44, category="Nutrition", image="/p.jpg", description="d"
        )
        set_inventory(self.protein, sku="SKU2", stock=0, reorder_at=15)

    def test_in_stock_reflects_inventory(self):
        response = self.client.get("/api/v1/products/tee/")
        self.assertTrue(response.data["inStock"])
        response = self.client.get("/api/v1/products/protein/")
        self.assertFalse(response.data["inStock"])

    def test_category_filter(self):
        response = self.client.get("/api/v1/products/?category=Apparel")
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], "tee")

    def test_in_stock_filter(self):
        response = self.client.get("/api/v1/products/?in_stock=true")
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], "tee")

    def test_search_filter(self):
        response = self.client.get("/api/v1/products/?search=protein")
        self.assertEqual(response.data["count"], 1)

    def test_nonexistent_slug_returns_404(self):
        response = self.client.get("/api/v1/products/does-not-exist/")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_member_cannot_create_product(self):
        member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.client.force_authenticate(user=member)
        response = self.client.post(
            "/api/v1/products/",
            {"slug": "new", "name": "New", "price": 10, "category": "X", "image": "x.jpg", "description": "d"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_creating_a_product_auto_provisions_inventory_at_zero_stock(self):
        """
        Without this, a newly-created product wouldn't appear on the
        Inventory page at all until someone manually added a row.
        """
        admin = User.objects.create_user(
            email="a@example.com", name="A", password="pw12345678", role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=admin)
        response = self.client.post(
            "/api/v1/products/",
            {
                "slug": "new-product",
                "name": "New Product",
                "price": 19.99,
                "category": "Apparel",
                "image": "x.jpg",
                "description": "d",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        product = Product.objects.get(slug="new-product")
        self.assertTrue(hasattr(product, "inventory"))
        self.assertEqual(product.inventory.stock, 0)
        self.assertFalse(response.data["inStock"])
