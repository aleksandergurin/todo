from rest_framework import serializers

from .models import Todo


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = (
            "id", "content", "created", "updated",
            "status", "city", "state", "country",
        )
