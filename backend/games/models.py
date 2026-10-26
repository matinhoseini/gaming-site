from django.db import models


class Game(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    genre = models.CharField(max_length=100)
    release_date = models.DateField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title