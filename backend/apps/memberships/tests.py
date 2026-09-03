from datetime import date, timedelta

from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User
from .models import Package, Membership


class PackageTests(APITestCase):
    """Covers: API validation, Permissions (package writes are admin-only)."""

    def setUp(self):
        self.package = Package.objects.create(name="Pro", price=59, billing="month", perks=["Classes"])
        self.member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.admin = User.objects.create_user(
            email="a@example.com", name="A", password="pw12345678", role=User.Role.ADMIN
        )

    def test_anyone_can_list_packages(self):
        response = self.client.get("/api/v1/packages/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)

    def test_member_cannot_create_package(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.post(
            "/api/v1/packages/", {"name": "Elite", "price": 99, "billing": "month", "perks": []}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_package(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/v1/packages/", {"name": "Elite", "price": 99, "billing": "month", "perks": []}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_deleting_package_with_active_membership_returns_409(self):
        member = User.objects.create_user(email="m2@example.com", name="M2", password="pw12345678")
        Membership.objects.create(
            user=member, package=self.package, status="active", renews_on=date.today() + timedelta(days=30)
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/v1/packages/{self.package.id}/")
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_force_delete_bypasses_conflict(self):
        member = User.objects.create_user(email="m3@example.com", name="M3", password="pw12345678")
        Membership.objects.create(
            user=member, package=self.package, status="active", renews_on=date.today() + timedelta(days=30)
        )
        self.client.force_authenticate(user=self.admin)
        response = self.client.delete(f"/api/v1/packages/{self.package.id}/?force=true")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.package.refresh_from_db()
        self.assertFalse(self.package.is_active)


class MembershipLifecycleTests(APITestCase):
    """Covers: Membership creation, Membership expiry (Phase 9 list)."""

    def setUp(self):
        self.member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        self.basic = Package.objects.create(name="Basic", price=29, billing="month", perks=[])
        self.pro = Package.objects.create(name="Pro", price=59, billing="month", perks=[])
        self.client.force_authenticate(user=self.member)

    def test_switch_creates_active_membership(self):
        response = self.client.post("/api/v1/memberships/switch/", {"packageId": self.basic.id}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "active")
        self.assertEqual(Membership.objects.filter(user=self.member).count(), 1)

    def test_switch_expires_previous_membership(self):
        self.client.post("/api/v1/memberships/switch/", {"packageId": self.basic.id}, format="json")
        self.client.post("/api/v1/memberships/switch/", {"packageId": self.pro.id}, format="json")
        memberships = Membership.objects.filter(user=self.member).order_by("id")
        self.assertEqual(memberships.count(), 2)
        self.assertEqual(memberships.first().status, "expired")
        self.assertEqual(memberships.last().status, "active")

    def test_switch_with_invalid_package_returns_400(self):
        response = self.client.post("/api/v1/memberships/switch/", {"packageId": 99999}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cancel_sets_status_to_expiring(self):
        self.client.post("/api/v1/memberships/switch/", {"packageId": self.basic.id}, format="json")
        response = self.client.post("/api/v1/memberships/cancel/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "expiring")

    def test_renew_resets_status_to_active_with_new_date(self):
        self.client.post("/api/v1/memberships/switch/", {"packageId": self.basic.id}, format="json")
        self.client.post("/api/v1/memberships/cancel/")
        response = self.client.post("/api/v1/memberships/renew/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "active")

    def test_me_reflects_active_membership(self):
        self.client.post("/api/v1/memberships/switch/", {"packageId": self.pro.id}, format="json")
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.data["plan"], "Pro")
        self.assertEqual(response.data["planStatus"], "active")


class MembershipExpirySweepTests(APITestCase):
    """Covers: Membership expiry via the Celery beat task (Phase 6/9)."""

    def test_expire_overdue_memberships_task(self):
        from apps.notifications.tasks import expire_overdue_memberships

        member = User.objects.create_user(email="m@example.com", name="M", password="pw12345678")
        package = Package.objects.create(name="Basic", price=29, billing="month", perks=[])
        overdue = Membership.objects.create(
            user=member, package=package, status="expiring", renews_on=date.today() - timedelta(days=1)
        )
        not_yet_due = Membership.objects.create(
            user=member, package=package, status="expiring", renews_on=date.today() + timedelta(days=5)
        )

        expire_overdue_memberships()

        overdue.refresh_from_db()
        not_yet_due.refresh_from_db()
        self.assertEqual(overdue.status, "expired")
        self.assertEqual(not_yet_due.status, "expiring")
