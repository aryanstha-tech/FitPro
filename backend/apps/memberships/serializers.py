from rest_framework import serializers
from .models import Package, Membership


class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ["id", "name", "price", "billing", "featured", "perks"]


class MembershipSerializer(serializers.ModelSerializer):
    packageId = serializers.PrimaryKeyRelatedField(
        source="package", queryset=Package.objects.filter(is_active=True), write_only=True
    )
    package = PackageSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ["id", "package", "packageId", "status", "started_on", "renews_on"]
        read_only_fields = ["status", "started_on", "renews_on"]
