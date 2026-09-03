from rest_framework import viewsets

from apps.accounts.permissions import IsAdmin
from .models import StaffMember
from .serializers import StaffMemberSerializer


class StaffViewSet(viewsets.ModelViewSet):
    """Admin only. /api/v1/staff/ — new staff default to inactive until they accept an invite."""

    queryset = StaffMember.objects.all()
    serializer_class = StaffMemberSerializer
    permission_classes = [IsAdmin]

    def perform_create(self, serializer):
        # TODO(notifications app): send invite email via Celery task once
        # email backend/config exists.
        serializer.save(status="inactive")
