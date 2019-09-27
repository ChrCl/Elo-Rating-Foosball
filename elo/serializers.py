from rest_framework import serializers
from elo.models import Player, Team, Match, Playerhistory


class PlayerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Player
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = '__all__'

class MatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = Match
        fields = '__all__'

class PlayerhistorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Playerhistory
        fields = '__all__'
