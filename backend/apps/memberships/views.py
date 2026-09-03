from datetime import date, timedelta

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.permissions import IsAdmin
from .models import Package, Membership
from .serializers import PackageSerializer, MembershipSerializer


class PackageViewSet(viewsets.ModelViewSet):
    """
    GET is public (drives the pricing page); writes are admin-only.
    /api/v1/packages/
    """

    queryset = Package.objects.filter(is_active=True)
    serializer_class = PackageSerializer

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [permissions.AllowAny()]
        return [IsAdmin()]

    def destroy(self, request, *args, **kwargs):
        package = self.get_object()
        force = request.query_params.get("force") == "true"
        has_active = Membership.objects.filter(package=package, status__in=["active", "expiring"]).exists()
        if has_active and not force:
            return Response(
                {"detail": "Package has active memberships. Pass ?force=true to soft-delete anyway."},
                status=status.HTTP_409_CONFLICT,
            )
        package.is_active = False
        package.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MyMembershipView(APIView):
    """GET /api/v1/memberships/me/"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        membership = (
            Membership.objects.filter(user=request.user, status__in=["active", "expiring"])
            .order_by("-renews_on")
            .first()
        )
        if not membership:
            return Response({"detail": "No active membership."}, status=status.HTTP_404_NOT_FOUND)
        return Response(MembershipSerializer(membership).data)


class SwitchMembershipView(APIView):
    """POST /api/v1/memberships/switch/  {packageId}"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        package_id = request.data.get("packageId")
        package = Package.objects.filter(id=package_id, is_active=True).first()
        if not package:
            return Response({"packageId": ["Invalid package."]}, status=status.HTTP_400_BAD_REQUEST)

        Membership.objects.filter(user=request.user, status__in=["active", "expiring"]).update(
            status=Membership.Status.EXPIRED
        )
        billing_days = 30 if package.billing == Package.Billing.MONTH else 365
        membership = Membership.objects.create(
            user=request.user,
            package=package,
            status=Membership.Status.ACTIVE,
            renews_on=date.today() + timedelta(days=billing_days),
        )
        return Response(MembershipSerializer(membership).data, status=status.HTTP_200_OK)


class RenewMembershipView(APIView):
    """POST /api/v1/memberships/renew/"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        membership = (
            Membership.objects.filter(user=request.user, status__in=["active", "expiring"])
            .order_by("-renews_on")
            .first()
        )
        if not membership:
            return Response({"detail": "No membership to renew."}, status=status.HTTP_404_NOT_FOUND)
        billing_days = 30 if membership.package.billing == Package.Billing.MONTH else 365
        membership.status = Membership.Status.ACTIVE
        membership.renews_on = date.today() + timedelta(days=billing_days)
        membership.save(update_fields=["status", "renews_on"])
        return Response(MembershipSerializer(membership).data)


class CancelMembershipView(APIView):
    """POST /api/v1/memberships/cancel/"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        membership = (
            Membership.objects.filter(user=request.user, status__in=["active", "expiring"])
            .order_by("-renews_on")
            .first()
        )
        if not membership:
            return Response({"detail": "No membership to cancel."}, status=status.HTTP_404_NOT_FOUND)
        membership.status = Membership.Status.EXPIRING
        membership.save(update_fields=["status"])
        return Response(MembershipSerializer(membership).data)
