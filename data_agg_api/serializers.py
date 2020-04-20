from rest_framework import serializers
from data_agg_api.models import Temperature

from django.contrib.auth.models import User

class TemperatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Temperature
        fields = ('id', 'temp', 'date_time')
