from rest_framework.routers import DefaultRouter
from .views import MyOrdersViewSet, OrderViewSet

router = DefaultRouter()
router.register("orders/me", MyOrdersViewSet, basename="order-me")
router.register("orders", OrderViewSet, basename="order")

urlpatterns = router.urls
