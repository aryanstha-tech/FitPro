"""
Shared membership-activation logic.

Extracted out of SwitchMembershipView so there's exactly one place that
expires an old membership and creates a new one — reused by:
  - SwitchMembershipView (now admin-only: manual/comp membership grants)
  - apps.orders.services (a real, Khalti-paid membership purchase),
    which must call this ONLY after payment is confirmed, never before.
"""

from datetime import date, timedelta

from .models import Package, Membership


def activate_membership(*, user, package: Package) -> Membership:
    Membership.objects.filter(user=user, status__in=["active", "expiring"]).update(
        status=Membership.Status.EXPIRED
    )
    billing_days = 30 if package.billing == Package.Billing.MONTH else 365
    return Membership.objects.create(
        user=user,
        package=package,
        status=Membership.Status.ACTIVE,
        renews_on=date.today() + timedelta(days=billing_days),
    )