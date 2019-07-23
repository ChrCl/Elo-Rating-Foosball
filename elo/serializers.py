from rest_framework import serializers
from elo.models import Player


class PlayerSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(max_length=100, allow_blank=False)
    rank = serializers.IntegerField(default=1500)

    def create(self, validated_data):
        """
        Create and return a new `Player` instance, given the validated data.
        """
        return Player.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Player` instance, given the validated data.
        """
        instance.name = validated_data.get('name', instance.name)
        instance.rank = validated_data.get('rank', instance.rank)
        instance.save()
        return instance
