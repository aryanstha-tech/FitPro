"""
Admin-facing member management — separate module from views.py (which
holds the member-facing auth endpoints) to keep the staff/admin surface
easy to find and audit independently.
"""

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import mixins, viewsets, filters, status
from rest_framework.response import Response

from .models import User
from .permissions import IsStaffOrAdmin
from .serializers import CurrentUserSerializer


class MemberViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    /api/v1/members/ — staff/admin only.
    GET list/retrieve, PATCH update, DELETE (deactivates, not a hard delete).

    Deliberately NOT a full ModelViewSet: there's no admin-facing POST
    (create). Member accounts are created via the self-service
    /auth/register/ flow, which sets a real password via create_user().
    CurrentUserSerializer has no password field, so a bare POST here
    would silently create an account with no usable password — worth
    fixing at the endpoint's shape, not papering over with a frontend
    form that calls a broken create.
    """

    queryset = User.objects.filter(role=User.Role.MEMBER)
    serializer_class = CurrentUserSerializer
    permission_classes = [IsStaffOrAdmin]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    search_fields = ["name", "email"]

    def destroy(self, request, *args, **kwargs):
        member = self.get_object()
        member.is_active = False
        member.save(update_fields=["is_active"])
        return Response(status=status.HTTP_204_NO_CONTENT)
