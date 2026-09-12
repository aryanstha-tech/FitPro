"""
Celery tasks — automated renewal emails and expiry handling
(Developer 1, Phase 6). Registered with Celery once config/celery.py's
app is wired up; run via `celery -A config worker` + `celery -A config beat`.
"""

from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_renewal_reminder(membership_id: int):
    from apps.memberships.models import Membership

    try:
        membership = Membership.objects.select_related("user", "package").get(id=membership_id)
    except Membership.DoesNotExist:
        return

    # EMAIL_BACKEND is currently the console backend (settings.py), so this
    # prints the full email to the `worker` container's logs instead of
    # actually delivering it — good enough to prove the flow end-to-end.
    # Swapping to a real provider (SES/SendGrid) later only means changing
    # EMAIL_BACKEND — this task doesn't need to change.
    if membership.status == "expiring":
        subject = "Your FitPro membership ends in 3 days"
        body = (
            f"Hi {membership.user.name},\n\n"
            f"Your cancelled {membership.package.name} membership ends on "
            f"{membership.renews_on}. Change your mind? You can renew from your dashboard."
        )
    else:
        subject = "Your FitPro membership renews in 3 days"
        body = (
            f"Hi {membership.user.name},\n\n"
            f"Your {membership.package.name} membership renews on {membership.renews_on}."
        )

    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [membership.user.email])


@shared_task
def send_expiry_reminders():
    """
    Finds every membership whose renews_on is exactly 3 days away and
    queues a reminder for each. Runs daily via CELERY_BEAT_SCHEDULE.

    Only ACTIVE and EXPIRING memberships are considered — EXPIRED ones
    are already lapsed, nothing to remind them about.

    Checking for an EXACT 3-day match (not "<= 3 days") means each
    membership only matches on one calendar day, so a reminder is sent
    once per renewal cycle rather than once a day for the last 3 days.
    """
    from datetime import date, timedelta
    from apps.memberships.models import Membership

    target_date = date.today() + timedelta(days=3)
    upcoming = Membership.objects.filter(status__in=["active", "expiring"], renews_on=target_date)

    for membership in upcoming:
        send_renewal_reminder.delay(membership.id)


@shared_task
def expire_overdue_memberships():
    from datetime import date
    from apps.memberships.models import Membership

    Membership.objects.filter(status="expiring", renews_on__lt=date.today()).update(status="expired")