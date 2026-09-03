from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from apps.accounts.models import User


class AuthTests(APITestCase):
    """Covers: Authentication, Permissions, API validation (Phase 9 list)."""

    def test_register_creates_user_and_returns_tokens(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {"name": "Alex Morgan", "email": "alex@example.com", "password": "SuperSecret123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", response.data["tokens"])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.first().role, User.Role.MEMBER)

    def test_register_rejects_duplicate_email(self):
        User.objects.create_user(email="alex@example.com", name="Existing", password="pw12345678")
        response = self.client.post(
            "/api/v1/auth/register/",
            {"name": "Dup", "email": "alex@example.com", "password": "SuperSecret123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_register_rejects_weak_password(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {"name": "Alex", "email": "weak@example.com", "password": "123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_with_correct_credentials_succeeds(self):
        User.objects.create_user(email="alex@example.com", name="Alex", password="SuperSecret123")
        response = self.client.post(
            "/api/v1/auth/login/",
            {"email": "alex@example.com", "password": "SuperSecret123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_with_wrong_password_returns_401(self):
        User.objects.create_user(email="alex@example.com", name="Alex", password="SuperSecret123")
        response = self.client.post(
            "/api/v1/auth/login/", {"email": "alex@example.com", "password": "wrong"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_requires_authentication(self):
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_current_user_when_authenticated(self):
        user = User.objects.create_user(email="alex@example.com", name="Alex", password="SuperSecret123")
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/v1/auth/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "alex@example.com")
        self.assertEqual(response.data["planStatus"], "expired")  # no membership yet


class MemberManagementPermissionTests(APITestCase):
    """Covers: Permissions — role-gated admin endpoints."""

    def setUp(self):
        self.member = User.objects.create_user(email="member@example.com", name="M", password="pw12345678")
        self.staff = User.objects.create_user(
            email="staff@example.com", name="S", password="pw12345678", role=User.Role.STAFF
        )

    def test_member_cannot_list_members(self):
        self.client.force_authenticate(user=self.member)
        response = self.client.get("/api/v1/members/")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_list_members(self):
        self.client.force_authenticate(user=self.staff)
        response = self.client.get("/api/v1/members/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_anonymous_cannot_list_members(self):
        response = self.client.get("/api/v1/members/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_post_to_members_is_not_allowed(self):
        """
        Member accounts are created via /auth/register/, which sets a
        real password with create_user(). CurrentUserSerializer (used
        for /members/) has no password field, so allowing POST here
        would silently create unusable accounts — the endpoint
        shouldn't expose create at all.
        """
        self.client.force_authenticate(user=self.staff)
        response = self.client.post(
            "/api/v1/members/", {"name": "New", "email": "new@example.com"}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
