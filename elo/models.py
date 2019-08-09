from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.

class Player(models.Model):
    name = models.CharField(unique=True, max_length=100, blank=False)
    rank = models.IntegerField(default=1500)
    win = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], blank=False)
    totalMatch = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], blank=False)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-rank']


class Team(models.Model):
    player1 = models.ForeignKey(Player, related_name='p1', on_delete=models.PROTECT)
    player2 = models.ForeignKey(Player, related_name='p2', on_delete=models.PROTECT)
    win = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], blank=False)
    totalMatch = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0)], blank=False)

    def __str__(self):
        return 'Team: %s and %s' % (self.player1, self.player2)

    class Meta:
        ordering = ['id']


class Match(models.Model):
    teamRed = models.ForeignKey(Team, related_name='Red', on_delete=models.PROTECT)
    teamBlue = models.ForeignKey(Team, related_name='Blue', on_delete=models.PROTECT)
    scoreRed = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)], blank=False)
    scoreBlue = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(10)], blank=False)
    datetime = models.DateTimeField()

    class Meta:
        ordering = ['-datetime', '-id']
