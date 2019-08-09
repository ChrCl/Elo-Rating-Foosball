from elo.models import Player, Team, Match
from elo.serializers import PlayerSerializer, TeamSerializer, MatchSerializer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
import statistics


# TO DO
# remove view for team creation url: /teams
# backtrack eloRank/recalcul if create date is < object match

class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def create(self, request, *args, **kwargs):
        ret = super().create(request, *args, **kwargs)
        player = ret.data
        player = Player.objects.get(pk=player['id'])
        partners = self.queryset.all()
        self.createTeams(partners, player)
        return ret

    def createTeams(self, partners, player):
        for partner in partners:
            if partner != player:
                partner = Player.objects.get(pk=partner.id)
                Team.objects.create(player1=player, player2=partner)
            else:
                print("Team must be 2 different player.")
        return

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
        return ret

    def computeElo(self, teamRed, scoreRed, teamBlue, scoreBlue):
        eloRankRed = statistics.mean([teamRed.player1.rank, teamRed.player2.rank])
        eloRankBlue = statistics.mean([teamBlue.player1.rank, teamBlue.player2.rank])
        elos = self.eloRank(eloRankRed, eloRankBlue, scoreRed, scoreBlue, teamRed, teamBlue)

        teamRed.player1.rank = teamRed.player1.rank + elos['plusEloRed']
        teamRed.player1.save()
        teamRed.player2.rank = teamRed.player2.rank + elos['plusEloRed']
        teamRed.player2.save()
        teamBlue.player1.rank = teamBlue.player1.rank + elos['plusEloBlue']
        teamBlue.player1.save()
        teamBlue.player2.rank = teamBlue.player2.rank + elos['plusEloBlue']
        teamBlue.player2.save()
        return

    def updateWinTotalMatch(self, team, result):
        if result == 'win':
            team.player1.win = team.player1.win +1
            team.player2.win = team.player2.win +1

        team.player1.totalMatch = team.player1.totalMatch +1
        team.player2.totalMatch = team.player2.totalMatch +1
        team.player1.save()
        team.player2.save()
        return

    def estimation(self, eloRank, eloRankAdv):
        estimation = eloRankAdv-eloRank
        estimation = 10*estimation+1
        estimation = 1/estimation
        return estimation

    def newElo(self, eloRank, const, result, estimation):
        newElo = result-estimation
        newElo = const*newElo
        newElo = eloRank+newElo
        return newElo

    def eloRank(self, eloRankRed, eloRankBlue, scoreRed, scoreBlue, teamRed, teamBlue):
        estimationRed = self.estimation(eloRankRed, eloRankBlue)
        estimationBlue = self.estimation(eloRankBlue, eloRankRed)
        redConst = self.constante(eloRankRed)
        blueConst = self.constante(eloRankBlue)

        if scoreRed > scoreBlue:
            redResult = 1.0
            blueResult = 0.0
            self.updateWinTotalMatch(teamRed, 'win')
            self.updateWinTotalMatch(teamBlue, '')
        elif scoreBlue >scoreRed:
            blueResult = 1.0
            redResult = 0.0
            self.updateWinTotalMatch(teamRed, '')
            self.updateWinTotalMatch(teamBlue, 'win')
        elif scoreRed == scoreBlue:
            redResult = 0.5
            blueResult = 0.5
        else:
            print("result impossible")
            return false

        newEloRed = self.newElo(eloRankRed, redConst, redResult, estimationRed)
        newEloBlue = self.newElo(eloRankBlue, blueConst, blueResult, estimationBlue)

        plusEloRed = newEloRed - eloRankRed
        plusEloBlue = newEloBlue - eloRankBlue
        return {'newEloRed': newEloRed, 'newEloBlue': newEloBlue, 'plusEloRed': plusEloRed, 'plusEloBlue': plusEloBlue}

    def constante(self, elo):
        if elo < 1000.0:
            result = 80.0
        elif elo >= 1000.0 and elo < 2000.0:
            result = 50.0
        elif elo >= 2000.0 and elo <= 2400.0:
            result = 30.0
        elif elo >2400.0:
            result = 20.0
        else:
            print('WARNING')
            return False
        return result

class MatchDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Match.objects.all()
    serializer_class = MatchSerializer


def playerDetails():
    players = Player.objects.all()
    dict = {}
    for player in players:
        dict[player.id] = {'name': player.name,
                           'win': player.win,
                           'total': player.totalMatch,
                           'loose': player.totalMatch - player.win,
                           'rank': player.rank,
                           'winrate': player.win / player.totalMatch}
    return dict

def teamDetails():
    teams = Team.objects.all()
    dict = {}
    for team in teams:
        dict[team.id] = {'player1': Player.objects(team.player1).name,
                         'player2': Player.objects(team.player2).name,
                         'win': team.win,
                         'total': team.totalMatch,
                         'loose': team.totalMatch - team.win,
                         'winrate': team.win / team.totalMatch}
    return dict

def MatchDetails():
    matchs = Match.objects.all()
    dict = {}
    for match in matchs:
        dict[match.id] = {'p1Red': Player.objects(Team.objects(match.teamRed)).player1,
                          'p2Red': Player.objects(Team.objects(match.teamRed)).player2,
                          'p1Blue': Player.objects(Team.objects(match.teamBlue)).player1,
                          'p2Blue': Player.objects(Team.objects(match.teamBlue)).player2,
                          'scoreRed': match.scoreRed,
                          'scoreBlue': match.scoreBlue,
                          'datetime': match.datetime}
    return dict

def lastMatch():
    match = Match.objects.all().order_by('-datetime')[:1]
    return match
