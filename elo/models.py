from django.db import models

# Create your models here.

class Player(models.Model):
    name = models.CharField(max_length=100, blank=False)
    rank = models.IntegerField(default=1500)

    class Meta:
        ordering = ['-rank']
