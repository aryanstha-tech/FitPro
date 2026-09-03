from django.urls import path
from .views import PaymentIntentView, PaymentWebhookView

urlpatterns = [
    path("payments/intent/", PaymentIntentView.as_view(), name="payment-intent"),
    path("payments/webhook/", PaymentWebhookView.as_view(), name="payment-webhook"),
]
