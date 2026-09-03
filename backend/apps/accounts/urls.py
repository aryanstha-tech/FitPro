from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, MeView
from .admin_views import MemberViewSet

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", LoginView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("me/", MeView.as_view(), name="auth-me"),
]

# Registered separately (not under /auth/) since /api/v1/members/ is its
# own top-level resource per API_CONTRACTS.md.
member_router = DefaultRouter()
member_router.register("members", MemberViewSet, basename="member")
member_urlpatterns = member_router.urls
