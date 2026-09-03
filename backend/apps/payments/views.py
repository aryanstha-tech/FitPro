from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .providers import get_payment_provider


class PaymentIntentView(APIView):
    """POST /api/v1/payments/intent/  {amount, currency}"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        amount = request.data.get("amount")
        currency = request.data.get("currency", "usd")
        if not amount:
            return Response({"amount": ["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)

        provider = get_payment_provider()
        result = provider.create_intent(amount=amount, currency=currency, idempotency_key=None)
        return Response({"clientSecret": result.client_secret, "reference": result.reference})


class PaymentWebhookView(APIView):
    """
    POST /api/v1/payments/webhook/
    Verifies the provider's signature rather than user auth — real
    signature verification is added alongside RealPaymentProvider.
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # TODO: verify provider signature header once RealPaymentProvider exists.
        return Response(status=status.HTTP_200_OK)
