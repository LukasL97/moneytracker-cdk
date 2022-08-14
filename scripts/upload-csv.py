import csv
import sys

import requests

def format_date(date):
    (day, month, year) = tuple(date.split('.'))
    return f'20{year}-{month.zfill(2)}-{day.zfill(2)}T00:00:00+02:00[Europe/Berlin]'

csv_file = sys.argv[1]
user = sys.argv[2]
url = sys.argv[3]
api_key = sys.argv[4]

records = []

with open(csv_file, mode='r') as file:
    reader = csv.reader(file, delimiter=',', quotechar='"')
    for row in reader:
        records.append({
            'title': row[0],
            'date': format_date(row[1]),
            'price': float(row[2]),
            'category': row[3],
            'user': user
        })

for record in records:
    response = requests.put(url, json=record, headers={'X-Api-Key': api_key})
    print(response)
