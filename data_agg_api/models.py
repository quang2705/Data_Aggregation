from django.db import models

# Create your models here.

class Temperature(models.Model):
    temp = models.FloatField()
    date_time = models.DateTimeField()

    class Meta:
        ordering = ['date_time']
    def __str__(self):
        return "Temperature " + str(self.temp) + " on " + str(self.date_time)
