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


@dataclass
class PaymentResult:
    success: bool
    reference: str
    client_secret: str | None = None


class PaymentProvider(ABC):
    @abstractmethod
    def create_intent(self, amount, currency: str, idempotency_key: str | None) -> PaymentResult:
        ...


class MockPaymentProvider(PaymentProvider):
    """Always succeeds — lets checkout/orders be built and tested before
    the real gateway exists."""

    def create_intent(self, amount, currency: str, idempotency_key=None) -> PaymentResult:
        return PaymentResult(
            success=True,
            reference=f"mock_{idempotency_key or 'no-key'}",
            client_secret="mock_client_secret",
        )


class RealPaymentProvider(PaymentProvider):
    """Placeholder for Developer 1's real gateway integration (e.g. Stripe).
    Not implemented yet — swap MockPaymentProvider for this once ready."""

    def create_intent(self, amount, currency: str, idempotency_key=None) -> PaymentResult:
        raise NotImplementedError("Real payment gateway not yet implemented.")


def get_payment_provider() -> PaymentProvider:
    from django.conf import settings

    if getattr(settings, "USE_REAL_PAYMENT_PROVIDER", False):
        return RealPaymentProvider()
    return MockPaymentProvider()
