import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','data_aggregate.settings')

import django
django.setup()

from data_agg_api.models import Temperature
import datetime
import random
import json
import requests

def create_temperatures():
    print("Generating fake temperature data...")
    no_data = 10
    date = datetime.date.today()
    for i in range (no_data):
        temp = round(random.uniform(-100, 100),2)
        hour = random.randint(0,23)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        time = datetime.time(hour, minute, second)
        oneday = datetime.timedelta(days=1)

        temperature = Temperature(temp=temp,date_time = str(date) + " " + str(time))
        date = date - oneday
        temperature.save()
        print("Create a temperature data at {0} Celcius, at {1} on {2}".format(temp, time, date))

def create_json_data(no_data=10):
    print("Generating fake JSON data...")
    data_json = {"data":[]}
    date = datetime.date.today()
    for i in range(no_data):
        temp = round(random.uniform(-100, 100),2)
        hour = random.randint(0,23)
        minute = random.randint(0, 59)
        second = random.randint(0, 59)
        time = datetime.time(hour, minute, second)
        oneday = datetime.timedelta(days=1)

        temperature = {
            "date_time": str(date) + " " + str(time),
            "val": temp
        }
        date = date - oneday
        data_json["data"].append(temperature)

    with open('data1.json', 'w') as json_file:
        json.dump(data_json, json_file)

def main():
    print("Type you command here: ", end='')
    usage = input()
    if (usage == 'simulate'):
        print("Number of data: ", end = '')
        no_data = int(input())
        print("Number of loops: ", end='')
        loop = int(input())
        for i in range(loop):
            print("generating and calling api")
            create_json_data(no_data)

            res = requests.post("http://localhost:8000/api/temperatures/upload/", data = {'data_file': open('data1.json', 'rb').read()})
            if res.status_code != 200:
                return 0

main()
