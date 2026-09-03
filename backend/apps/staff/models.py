from django.db import models


class StaffMember(models.Model):
    """
    Matches the StaffMember TS interface in frontend/lib/mock-data.ts.
    Deliberately separate from accounts.User: gym staff (coaches, front
    desk) don't necessarily need platform login accounts, and the plan
    lists Staff Management as its own admin page/resource.
    """

    class Role(models.TextChoices):
        COACH = "Coach", "Coach"
        FRONT_DESK = "Front Desk", "Front Desk"
        MANAGER = "Manager", "Manager"

    name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=Role.choices)
    status = models.CharField(
        max_length=10, choices=[("active", "Active"), ("inactive", "Inactive")], default="inactive"
    )

    def __str__(self):
        return f"{self.name} ({self.role})"
