"""
Payment abstraction per the plan's Phase 6:

    PaymentInterface -> MockPaymentProvider -> RealPaymentProvider

Developer 2 (orders/checkout) codes against `PaymentProvider` and uses
`MockPaymentProvider` without waiting on Developer 1's real gateway.
Developer 1 implements `RealPaymentProvider` independently; swapping it
in is a one-line change in `get_payment_provider()`.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass

import requests


@dataclass
class PaymentResult:
    success: bool
    reference: str
    client_secret: str | None = None
    # Set only by redirect-based gateways (Khalti). When present, the
    # frontend must send the browser here instead of treating the order
    # as paid — the payment isn't actually confirmed until the separate
    # verify step runs, after the user returns from this URL.
    redirect_url: str | None = None


class PaymentProvider(ABC):
    @abstractmethod
    def create_intent(self, amount, currency: str, idempotency_key: str | None, **kwargs) -> PaymentResult:
        ...

    def verify(self, reference: str) -> bool:
        """
        Confirms a previously-created payment actually completed.
        Only meaningful for redirect-based gateways — MockPaymentProvider
        already knows success at create_intent() time, so it doesn't
        need this. KhaltiProvider overrides it for real.
        """
        raise NotImplementedError


class MockPaymentProvider(PaymentProvider):
    """Always succeeds — lets checkout/orders be built and tested before
    the real gateway exists."""

    def create_intent(self, amount, currency: str, idempotency_key=None, **kwargs) -> PaymentResult:
        return PaymentResult(
            success=True,
            reference=f"mock_{idempotency_key or 'no-key'}",
            client_secret="mock_client_secret",
        )


class KhaltiProvider(PaymentProvider):
    """
    Khalti ePayment v2 (Nepal). Unlike a card-token gateway, this is a
    redirect flow: create_intent() only *starts* the payment and returns
    a payment_url — it does NOT mean money has moved. The caller must
    redirect the browser there, and later call verify() with the pidx
    once Khalti redirects back, before treating the order as paid.

    Docs: https://docs.khalti.com/khalti-epayment/
    Sandbox signup (free): https://test-admin.khalti.com/#/join/merchant
    """

    def __init__(self):
        from django.conf import settings

        self.secret_key = settings.KHALTI_SECRET_KEY
        self.base_url = settings.KHALTI_BASE_URL
        self.return_url = settings.KHALTI_RETURN_URL
        self.website_url = settings.KHALTI_WEBSITE_URL

    def _headers(self):
        # Khalti's own docs show the "Key" prefix lowercase in some
        # examples and capitalized in others — Khalti's API accepts
        # either case, but the prefix itself is required (its absence
        # is one of Khalti's documented generic errors).
        return {"Authorization": f"Key {self.secret_key}", "Content-Type": "application/json"}

    def create_intent(self, amount, currency: str, idempotency_key=None, **kwargs) -> PaymentResult:
        # Khalti requires the amount in paisa (1 NPR = 100 paisa), as an
        # integer — `amount` here is a Decimal NPR total from create_order().
        amount_paisa = int(round(float(amount) * 100))

        payload = {
            "return_url": self.return_url,
            "website_url": self.website_url,
            "amount": amount_paisa,
            "purchase_order_id": kwargs.get("purchase_order_id", idempotency_key or "order"),
            "purchase_order_name": kwargs.get("purchase_order_name", "FitPro order"),
        }
        customer_info = kwargs.get("customer_info")
        if customer_info:
            payload["customer_info"] = customer_info

        response = requests.post(
            f"{self.base_url}/epayment/initiate/", json=payload, headers=self._headers(), timeout=10
        )
        if response.status_code != 200:
            # Khalti returns a validation_error body on 400s — surface it
            # rather than a generic failure so mistakes are easy to debug.
            return PaymentResult(success=False, reference="", client_secret=None)

        data = response.json()
        return PaymentResult(
            success=True,
            reference=data["pidx"],
            client_secret=None,
            redirect_url=data["payment_url"],
        )

    def verify(self, reference: str) -> bool:
        response = requests.post(
            f"{self.base_url}/epayment/lookup/",
            json={"pidx": reference},
            headers=self._headers(),
            timeout=10,
        )
        if response.status_code != 200:
            return False
        # Per Khalti's own docs: ONLY "Completed" counts as paid. Pending,
        # Expired, Refunded, and User canceled must all be treated as
        # not-paid, even though some of those return HTTP 200.
        return response.json().get("status") == "Completed"


class RealPaymentProvider(PaymentProvider):
    """Placeholder for Developer 1's real gateway integration (e.g. Stripe).
    Not implemented yet — swap MockPaymentProvider for this once ready."""

    def create_intent(self, amount, currency: str, idempotency_key=None, **kwargs) -> PaymentResult:
        raise NotImplementedError("Real payment gateway not yet implemented.")


def get_payment_provider() -> PaymentProvider:
    from django.conf import settings

    if getattr(settings, "USE_REAL_PAYMENT_PROVIDER", False):
        return KhaltiProvider()
    return MockPaymentProvider()