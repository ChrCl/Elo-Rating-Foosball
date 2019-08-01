from django.db import models

# Create your models here.

class Player(models.Model):
    name = models.CharField(max_length=100, blank=False)
    rank = models.IntegerField(default=1500)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-rank']


class Team(models.Model):
    player1 = models.ForeignKey(Player, related_name='p1', on_delete=models.PROTECT)
    player2 = models.ForeignKey(Player, related_name='p2', on_delete=models.PROTECT)

    def __str__(self):
        return 'Team: %s and %s' % (self.player1, self.player2)

    class Meta:
        ordering = ['id']


class Match(models.Model):
    team1 = models.ForeignKey(Team, related_name='t1', on_delete=models.PROTECT)
    team2 = models.ForeignKey(Team, related_name='t2', on_delete=models.PROTECT)
    score1 = models.IntegerField(default=0, blank=False)
    score2 = models.IntegerField(default=0, blank=False)
    datetime = models.DateTimeField()

    class Meta:
        ordering = ['-datetime']
