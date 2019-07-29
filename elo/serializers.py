from rest_framework import serializers
from elo.models import Player


class PlayerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Player
        fields = ['id', 'name', 'rank']
