from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class CurrentUserSerializer(serializers.ModelSerializer):
    """Matches the CurrentUser TS interface in frontend/lib/mock-data.ts."""

    memberSince = serializers.DateTimeField(source="date_joined", format="%B %Y", read_only=True)
    plan = serializers.SerializerMethodField()
    planStatus = serializers.SerializerMethodField()
    renewsOn = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "name", "email", "memberSince", "plan", "planStatus", "renewsOn", "role"]

    def get_active_membership(self, obj):
        # Local import avoids a circular import between accounts <-> memberships.
        from apps.memberships.models import Membership

        return (
            Membership.objects.filter(user=obj, status__in=["active", "expiring"])
            .select_related("package")
            .order_by("-renews_on")
            .first()
        )

    def get_plan(self, obj):
        m = self.get_active_membership(obj)
        return m.package.name if m else None

    def get_planStatus(self, obj):
        m = self.get_active_membership(obj)
        return m.status if m else "expired"

    def get_renewsOn(self, obj):
        m = self.get_active_membership(obj)
        return m.renews_on.isoformat() if m else None


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["name", "email", "password"]

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
