from elo.models import Player, Team, Match
from elo.serializers import PlayerSerializer, TeamSerializer, MatchSerializer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response


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
        # team1 = match['team1']
        # team2 = match['team2']
        if match['score1'] > match['score2']:
        elif match['score1'] < match['score2']:
        elif match['score1'] == match['score2']:
        computeElo(match.team1, match.score1, match.team2, match.score2)
        computeElo(match.team2, match.score2, match.team1, match.score1)
        # eloScoreT1 = ...
        # eloScoreT2 = ...
        # for each player in team1
        #     update rank (eloScoreT1)
        # for each player in team2
        #     update rank (eloScoreT2)

        # TO DO
        /*
         computeElo ( team, scoreTeam, teamAdv, scoreAdv ):

            eloRank = average (team.player1.rank, team.player2.rank)
            advElo = average (teamAdv.player1.rank, teamAdv.player2.rank)
            newEloRank = ...
            team.player1.rank += newEloRank
            team.player2.rank += newEloRank

         */


        return ret

    # def updateScore(self):
    #     super(create())

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer
