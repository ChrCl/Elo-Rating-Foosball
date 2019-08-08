from elo.models import Player, Team, Match
from elo.serializers import PlayerSerializer, TeamSerializer, MatchSerializer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
import statistics


class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class PlayerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

class TeamList(generics.ListCreateAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class TeamDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer

class MatchList(generics.ListCreateAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer

    def create(self, request, *args, **kwargs):
        ret = super().create(request, *args, **kwargs)
        match = ret.data
        teamRed = Team.objects.get(pk=match['teamRed'])
        teamBlue = Team.objects.get(pk=match['teamBlue'])
        self.computeElo(teamRed, match['scoreRed'], teamBlue, match['scoreBlue'])
        # self.computeElo(teamBlue, match['scoreBlue'], teamRed, match['scoreRed'])
        return ret

    def computeElo(self, team, scoreTeam, teamAdv, scoreAdv):
        eloRank = statistics.mean([team.player1.rank, team.player2.rank])
        eloRankAdv = statistics.mean([teamAdv.player1.rank, teamAdv.player2.rank])
        team.player1.rank = eloRank
        team.player1.save()
        return

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
