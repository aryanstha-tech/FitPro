from django.conf import settings
from django.db import models


class Package(models.Model):
    """Matches the Package TS interface in frontend/lib/mock-data.ts."""

    class Billing(models.TextChoices):
        MONTH = "month", "Monthly"
        YEAR = "year", "Yearly"

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    billing = models.CharField(max_length=5, choices=Billing.choices, default=Billing.MONTH)
    featured = models.BooleanField(default=False)
    perks = models.JSONField(default=list, help_text="List of perk strings.")
    is_active = models.BooleanField(default=True)  # soft-delete flag

    class Meta:
        ordering = ["price"]

    def __str__(self):
        return self.name


class Membership(models.Model):
    """A member's subscription to a Package."""

    class Status(models.TextChoices):
        ACTIVE = "active", "Active"
        EXPIRING = "expiring", "Expiring"
        EXPIRED = "expired", "Expired"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="memberships")
    package = models.ForeignKey(Package, on_delete=models.PROTECT, related_name="memberships")
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.ACTIVE)
    started_on = models.DateField(auto_now_add=True)
    renews_on = models.DateField()

    class Meta:
        ordering = ["-renews_on"]

    def __str__(self):
        return f"{self.user.email} — {self.package.name} ({self.status})"
