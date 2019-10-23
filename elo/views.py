from elo.models import Player, Team, Match, Playerhistory
from elo.serializers import PlayerSerializer, TeamSerializer, MatchSerializer, PlayerhistorySerializer
from rest_framework import generics
from rest_framework import viewsets
from rest_framework.response import Response
from url_filter.integrations.drf import DjangoFilterBackend
import statistics
import logging

logger = logging.getLogger(__name__)

class PlayerList(generics.ListCreateAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

    def create(self, request, *args, **kwargs):
        partners = self.queryset.all()
        ret = super().create(request, *args, **kwargs)
        player = ret.data
        player = Player.objects.get(name=player['name'])
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
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['player1', 'player2']

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
        self.computeElo(teamRed, teamBlue, match)
        return ret

    def computeElo(self, teamRed, teamBlue, match):
        scoreRed = match['scoreRed']
        scoreBlue = match['scoreBlue']
        eloRankRed = statistics.mean([teamRed.player1.rank, teamRed.player2.rank])
        eloRankBlue = statistics.mean([teamBlue.player1.rank, teamBlue.player2.rank])
        elos = self.eloRank(eloRankRed, eloRankBlue, scoreRed, scoreBlue, teamRed, teamBlue)

        logger.info('Computed ELO for Red (' + str(teamRed) + ') and Blue (' + str(teamBlue) + ') is ' + str(elos))

        teamRed.player1.rank = teamRed.player1.rank + elos['plusEloRed']
        teamRed.player2.rank = teamRed.player2.rank + elos['plusEloRed']
        teamBlue.player1.rank = teamBlue.player1.rank + elos['plusEloBlue']
        teamBlue.player2.rank = teamBlue.player2.rank + elos['plusEloBlue']
        matchObj = Match.objects.get(pk=match['id'])
        Playerhistory.objects.create(player=teamRed.player1, match=matchObj, result=elos['redResult'], rank=teamRed.player1.rank)
        Playerhistory.objects.create(player=teamRed.player2, match=matchObj, result=elos['redResult'], rank=teamRed.player2.rank)
        Playerhistory.objects.create(player=teamBlue.player1, match=matchObj, result=elos['blueResult'], rank=teamBlue.player1.rank)
        Playerhistory.objects.create(player=teamBlue.player2, match=matchObj, result=elos['blueResult'], rank=teamBlue.player2.rank)
        teamRed.player1.save()
        teamRed.player2.save()
        teamBlue.player1.save()
        teamBlue.player2.save()
        return

    def updateWinTotalMatch(self, team, result):
        if result == 'win':
            team.player1.win += 1
            team.player2.win += 1
            team.win += 1
        elif result == 'draw':
            team.player1.draw += 1
            team.player2.draw += 1
            team.draw += 1

        team.player1.totalMatch += 1
        team.player2.totalMatch += 1
        team.totalMatch += 1
        team.player1.save()
        team.player2.save()
        team.save()
        return

    def estimation(self, eloRank, eloRankAdv):
        estimation = eloRankAdv-eloRank
        estimation = 10*estimation+1
        estimation = 1/estimation
        return estimation

    def newElo(self, eloRank, const, result, estimation):
        logger.info('New ELO ' + str(result) + ' - ' + str(estimation) + ' * ' + str(const) + ' + ' + str(eloRank) + 'types eloRank=' + str(type(eloRank)) + ', const=' + str(type(const)) + ', result=' + str(type(result)) + ', estimation=' + str(type(estimation)))
        newElo = result-estimation
        newElo = const*newElo
        newElo = eloRank+newElo
        return newElo

    def eloRank(self, eloRankRed, eloRankBlue, scoreRed, scoreBlue, teamRed, teamBlue):
        estimationRed = self.estimation(eloRankRed, eloRankBlue)
        estimationBlue = self.estimation(eloRankBlue, eloRankRed)
        redConst = self.constante(eloRankRed)
        blueConst = self.constante(eloRankBlue)
        redResult = 'D'
        blueResult = 'D'

        if scoreRed > scoreBlue:
            redScore = 1.0
            blueScore = 0.0
            redResult = 'W'
            blueResult = 'L'
            self.updateWinTotalMatch(teamRed, 'win')
            self.updateWinTotalMatch(teamBlue, '')
        elif scoreBlue >scoreRed:
            redScore = 0.0
            blueScore = 1.0
            redResult = 'L'
            blueResult = 'W'
            self.updateWinTotalMatch(teamRed, '')
            self.updateWinTotalMatch(teamBlue, 'win')
        elif scoreRed == scoreBlue:
            redScore = 0.5
            blueScore = 0.5
            self.updateWinTotalMatch(teamRed, '')
            self.updateWinTotalMatch(teamBlue, '')
        else:
            print("result impossible")
            return false

        newEloRed = self.newElo(eloRankRed, redConst, redScore, estimationRed)
        newEloBlue = self.newElo(eloRankBlue, blueConst, blueScore, estimationBlue)

        plusEloRed = newEloRed - eloRankRed
        plusEloBlue = newEloBlue - eloRankBlue
        return {
            'newEloRed': newEloRed,
            'newEloBlue': newEloBlue,
            'plusEloRed': plusEloRed,
            'plusEloBlue': plusEloBlue,
            'redResult': redResult,
            'blueResult': blueResult
        }

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

class PlayerhistoryDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Playerhistory.objects.all()
    serializer_class = PlayerhistorySerializer
    lookup_field = 'player'

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
