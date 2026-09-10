"""
Root URL conf — every app's urls.py is included under /api/v1/, per
API_CONTRACTS.md. Django admin stays at /admin/ for staff data entry
during development.
"""
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from apps.accounts.urls import member_urlpatterns

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("apps.accounts.urls")),
    path("api/v1/", include(member_urlpatterns)),
    path("api/v1/", include("apps.memberships.urls")),
    path("api/v1/", include("apps.products.urls")),
    path("api/v1/", include("apps.inventory.urls")),
    path("api/v1/", include("apps.orders.urls")),
    path("api/v1/", include("apps.staff.urls")),
    path("api/v1/", include("apps.payments.urls")),
    path("api/v1/", include("apps.analytics.urls")),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
