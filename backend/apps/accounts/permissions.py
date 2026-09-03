from rest_framework.permissions import BasePermission


class IsStaffOrAdmin(BasePermission):
    """Staff/Manager-level access — memberships, products write, orders, inventory, dashboard."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role in ("staff", "admin")
        )


class IsAdmin(BasePermission):
    """Admin-only — packages write, staff management, member delete."""

    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.role == "admin"
        )
