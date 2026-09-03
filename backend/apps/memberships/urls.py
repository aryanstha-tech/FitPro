from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    PackageViewSet,
    MyMembershipView,
    SwitchMembershipView,
    RenewMembershipView,
    CancelMembershipView,
)

router = DefaultRouter()
router.register("packages", PackageViewSet, basename="package")

membership_urlpatterns = [
    path("memberships/me/", MyMembershipView.as_view(), name="membership-me"),
    path("memberships/switch/", SwitchMembershipView.as_view(), name="membership-switch"),
    path("memberships/renew/", RenewMembershipView.as_view(), name="membership-renew"),
    path("memberships/cancel/", CancelMembershipView.as_view(), name="membership-cancel"),
]

urlpatterns = router.urls + membership_urlpatterns
