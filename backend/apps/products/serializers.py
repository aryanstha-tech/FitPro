from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    inStock = serializers.BooleanField(source="in_stock", read_only=True)

    class Meta:
        model = Product
        fields = ["id", "slug", "name", "price", "category", "image", "description", "inStock"]
