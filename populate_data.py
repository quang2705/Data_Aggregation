import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE','data_aggregate.settings')

import django
django.setup()

from data_agg_api.models import Temperature
import datetime
import random
import json

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

def create_json_data():
    print("Generating fake JSON data...")
    data_json = {"data":[]}
    no_data = 10
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
    create_temperatures()
    create_json_data()

main()
