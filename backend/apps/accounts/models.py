from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    """Email-based manager — AbstractUser's default manager assumes a
    `username` field, which this model doesn't have."""

    use_in_migrations = True

    def _create_user(self, email, name, password, **extra_fields):
        if not email:
            raise ValueError("Email is required.")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, name="", password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, name, password, **extra_fields)

    def create_superuser(self, email, name="", password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("role", User.Role.ADMIN)
        return self._create_user(email, name, password, **extra_fields)


class User(AbstractUser):
    """
    Email-based auth. `role` drives the permission table in
    API_CONTRACTS.md (member / staff / admin) and the frontend's
    dashboard/admin route guards.
    """

    class Role(models.TextChoices):
        MEMBER = "member", "Member"
        STAFF = "staff", "Staff"
        ADMIN = "admin", "Admin"

    class Gender(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    username = None
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.MEMBER)
    phone = models.CharField(
        max_length=15,
        blank=False,
    )

    address = models.CharField(max_length=255, blank=False,)
    gender = models.CharField(max_length=10, choices=Gender.choices, blank=False,)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = UserManager()

    class Meta:
        ordering = ["email"]

    def __str__(self):
        return self.email
