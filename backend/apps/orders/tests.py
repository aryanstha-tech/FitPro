from django.db import IntegrityError, transaction
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from apps.products.models import Product
from apps.inventory.models import InventoryItem
from .models import Order
from .services import create_order, OutOfStockError


from apps.inventory.test_helpers import set_inventory

_product_counter = [0]


def make_product_with_stock(stock=10, reorder_at=2):
    _product_counter[0] += 1
    n = _product_counter[0]
    product = Product.objects.create(
        slug=f"tee-{n}", name=f"Tee {n}", price=28, category="Apparel", image="/tee.jpg", description="A tee"
    )
    inventory = set_inventory(product, sku=f"SKU{n}", stock=stock, reorder_at=reorder_at)
    return product, inventory


class OrderCreationTests(APITestCase):
    """
    Covers the highest-risk items on the Phase 9 test list: stock
    decrement, negative-stock prevention, order creation, duplicate
    payment prevention.
    """

    def setUp(self):
        self.member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.product, self.inventory = make_product_with_stock(stock=5)
        self.client.force_authenticate(user=self.member)

    def test_order_creation_decrements_stock(self):
        response = self.client.post(
            "/api/v1/orders/",
            {"items": [{"productId": self.product.id, "quantity": 2}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.stock, 3)
        self.assertEqual(float(response.data["total"]), 56.0)

    def test_order_exceeding_stock_returns_409_and_leaves_stock_unchanged(self):
        response = self.client.post(
            "/api/v1/orders/",
            {"items": [{"productId": self.product.id, "quantity": 999}]},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.stock, 5)  # unchanged — transaction rolled back
        self.assertEqual(Order.objects.count(), 0)  # no partial order left behind

    def test_duplicate_idempotency_key_returns_same_order_without_double_decrement(self):
        payload = {"items": [{"productId": self.product.id, "quantity": 2}], "idempotencyKey": "abc123"}
        first = self.client.post("/api/v1/orders/", payload, format="json")
        second = self.client.post("/api/v1/orders/", payload, format="json")

        self.assertEqual(first.data["id"], second.data["id"])
        self.assertEqual(Order.objects.count(), 1)
        self.inventory.refresh_from_db()
        self.assertEqual(self.inventory.stock, 3)  # decremented once, not twice

    def test_negative_stock_is_impossible_at_the_database_level(self):
        """
        Bypasses the application layer entirely — directly attempts to
        write negative stock — to prove the DB CheckConstraint is the
        real backstop, not just the service-layer stock check.
        """
        self.inventory.stock = -1
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                self.inventory.save()

    def test_order_creation_is_atomic_across_multiple_items(self):
        """If one item in a multi-item order is oversold, none of the
        items should decrement — not just the failing one."""
        product2, inventory2 = make_product_with_stock(stock=1)
        response = self.client.post(
            "/api/v1/orders/",
            {
                "items": [
                    {"productId": self.product.id, "quantity": 1},  # would succeed alone
                    {"productId": product2.id, "quantity": 999},  # will fail
                ]
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.inventory.refresh_from_db()
        inventory2.refresh_from_db()
        self.assertEqual(self.inventory.stock, 5)  # untouched, even though this item alone was fine
        self.assertEqual(inventory2.stock, 1)

    def test_member_cannot_see_others_orders_or_the_admin_list(self):
        other = User.objects.create_user(email="other@example.com", name="Other", password="pw12345678")
        create_order(user=other, items=[{"productId": self.product.id, "quantity": 1}])

        response = self.client.get("/api/v1/orders/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)  # only own orders, none yet for self.member

        admin_list_response = self.client.get("/api/v1/orders/")
        self.assertEqual(admin_list_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_list_and_update_order_status(self):
        staff = User.objects.create_user(
            email="staff@example.com", name="Staff", password="pw12345678", role=User.Role.STAFF
        )
        order = create_order(user=self.member, items=[{"productId": self.product.id, "quantity": 1}])

        self.client.force_authenticate(user=staff)
        list_response = self.client.get("/api/v1/orders/")
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data["count"], 1)

        update_response = self.client.patch(f"/api/v1/orders/{order.id}/", {"status": "delivered"}, format="json")
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        order.refresh_from_db()
        self.assertEqual(order.status, "delivered")


class OrderServiceUnitTests(APITestCase):
    """Direct unit tests against services.create_order, bypassing the API layer."""

    def setUp(self):
        self.member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.product, self.inventory = make_product_with_stock(stock=3)

    def test_out_of_stock_error_has_409_status_code(self):
        with self.assertRaises(OutOfStockError) as ctx:
            create_order(user=self.member, items=[{"productId": self.product.id, "quantity": 10}])
        self.assertEqual(ctx.exception.status_code, 409)
