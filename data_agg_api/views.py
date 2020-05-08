from django.shortcuts import render

from rest_framework import viewsets
from rest_framework.response import Response

from data_agg_api.models import Temperature
from data_agg_api.serializers import TemperatureSerializer
from data_agg_api.utils import check_for_key

from rest_framework.decorators import action, parser_classes
from rest_framework.parsers import JSONParser, FileUploadParser
import json


class TemperatureViewSet(viewsets.ModelViewSet):
	queryset = Temperature.objects.all()
	serializer_class = TemperatureSerializer

	#POST method for uploading 1 data point of temperature
	def create(self, request):
		key_list = ['temp', 'date', 'time']
		check_for_key(request.data, key_list)

		temperature = Temperature(temp=request.data['temp'],
									date_time=request.data['date'] + " " + request.data['time'])
		temperature.save()
		temperature_serializer = TemperatureSerializer(temperature, many=False, context={'request':request})
		return Response(temperature_serializer.data)

	#filter based on time the data is taken
	def get_queryset(self):
		temperatures = Temperature.objects.all()
		#filter date by lte: less than or equal, gte: greater than or equal
		#lt: less than, gt: greater than
		operators = ['lte', 'lt', 'gte', 'gt']
		for operator in operators:
			datetime = self.request.query_params.get('datetime[{}]'.format(operator), None)
			if datetime is not None:
				date = datetime.split('T')[0]
				time = datetime.split('T')[1]
				temperatures = temperatures.filter(**{'date_time__{}'.format(operator):date + " " + time})

		return temperatures

	@action(methods=['post'], detail=False)
	@parser_classes([FileUploadParser])
	def upload(self, request):
		file = request.data['data_file']
		if (type(file) == str):
			data = file
		else:
			data = file.read().decode('utf-8')
		data = json.loads(data)
		for data_point in data['data']:
			temp = data_point['val']
			date = data_point['date_time'].split(' ')[0]
			time = data_point['date_time'].split(' ')[1]

			temperature = Temperature(temp=temp,
							date_time = date + " " + time)
			temperature.save()

		return Response({'received data': request.data})
