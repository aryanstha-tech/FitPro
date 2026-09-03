"""
Celery tasks — automated renewal emails and expiry handling
(Developer 1, Phase 6). Registered with Celery once config/celery.py's
app is wired up; run via `celery -A config worker` + `celery -A config beat`.
"""

from celery import shared_task


@shared_task
def send_renewal_reminder(membership_id: int):
    from apps.memberships.models import Membership

    try:
        membership = Membership.objects.select_related("user", "package").get(id=membership_id)
    except Membership.DoesNotExist:
        return
    # TODO: wire up an actual email backend (SES/SendGrid/etc). For now
    # this proves the task path end-to-end without needing real infra.
    print(f"[stub email] Renewal reminder -> {membership.user.email} for {membership.package.name}")


@shared_task
def expire_overdue_memberships():
    from datetime import date
    from apps.memberships.models import Membership

    Membership.objects.filter(status="expiring", renews_on__lt=date.today()).update(status="expired")
