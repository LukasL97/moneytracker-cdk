import requests
import unittest
import os
import boto3

api_endpoint = os.getenv('DEV_API_ENDPOINT')
api_key = os.getenv('DEV_API_KEY')

db_table_name = 'records'

db_client = boto3.client('dynamodb')


def clear_db():
    ids = [item['id']['S'] for item in get_db_items()]
    for id in ids:
        db_client.delete_item(TableName=db_table_name, Key={'id': {'S': id}})


def get_db_items():
    result = db_client.scan(TableName=db_table_name)
    return result['Items']


def put_into_db(item):
    db_client.put_item(TableName=db_table_name, Item=item)


def to_db_item(record):
    return {
        'id': {
            'S': record['id']
        },
        'title': {
            'S': record['title']
        },
        'date': {
            'S': record['date']
        },
        'price': {
            'N': str(record['price'])
        },
        'category': {
            'S': record['category']
        },
        'user': {
            'S': record['user']
        }
    }


def put_record(record):
    return requests.put(api_endpoint + '/records', json=record, headers={'X-Api-Key': api_key})


def get_records(user):
    return requests.get(api_endpoint + f'/records?user={user}', headers={'X-Api-Key': api_key})


def delete_record(id):
    return requests.delete(api_endpoint + f'/records/{id}', headers={'X-Api-Key': api_key})


record = {
    'title': 'record',
    'date': '2022-08-16T07:17:49+02:00[Europe/Berlin]',
    'price': 1337.42,
    'category': 'category',
    'user': 'user'
}


class ApiTest(unittest.TestCase):

    def setUp(self):
        clear_db()

    def test_put_record(self):
        self.assertEqual(len(get_db_items()), 0)

        response = put_record(record)
        self.assertEqual(response.status_code, 200)

        db_items = get_db_items()
        self.assertEqual(len(db_items), 1)
        db_item = db_items[0]
        self.assertEqual(db_item['title']['S'], record['title'])
        self.assertEqual(db_item['date']['S'], record['date'])
        self.assertEqual(float(db_item['price']['N']), record['price'])
        self.assertEqual(db_item['category']['S'], record['category'])
        self.assertEqual(db_item['user']['S'], record['user'])

    def test_get_records(self):
        self.assertEqual(len(get_db_items()), 0)

        user_record_1 = record.copy()
        user_record_1['id'] = '9645809d-c020-45be-970a-cb87d02e6bb0'
        user_record_2 = record.copy()
        user_record_2['id'] = '384e021c-0fcf-44ad-9110-8f714e69cd71'
        other_record = record.copy()
        other_record['id'] = '718aacda-2104-46e0-8caa-a4a3d3539f55'
        other_record['user'] = 'other'

        put_into_db(to_db_item(user_record_1))
        put_into_db(to_db_item(user_record_2))
        put_into_db(to_db_item(other_record))

        self.assertEqual(len(get_db_items()), 3)

        response = get_records(user_record_1['user'])
        self.assertEqual(response.status_code, 200)
        response_records = response.json()
        self.assertEqual(len(response_records), 2)

        response_user_record_1 = [r for r in response_records if r['id'] == user_record_1['id']][0]
        response_user_record_2 = [r for r in response_records if r['id'] == user_record_2['id']][0]
        self.assertEqual(response_user_record_1, user_record_1)
        self.assertEqual(response_user_record_2, user_record_2)


    def test_put_get_delete_record(self):
        self.assertEqual(len(get_db_items()), 0)

        put_response = put_record(record)
        self.assertEqual(put_response.status_code, 200)

        self.assertEqual(len(get_db_items()), 1)

        get_response = get_records(record['user'])
        self.assertEqual(get_response.status_code, 200)
        response_records = get_response.json()
        self.assertEqual(len(response_records), 1)
        response_record = response_records[0]
        self.assertEqual(response_record['title'], record['title'])
        self.assertEqual(response_record['date'], record['date'])
        self.assertEqual(response_record['price'], record['price'])
        self.assertEqual(response_record['category'], record['category'])
        self.assertEqual(response_record['user'], record['user'])

        record_id = response_record['id']
        delete_response = delete_record(record_id)
        self.assertEqual(delete_response.status_code, 202)

        self.assertEqual(len(get_db_items()), 0)


if __name__ == '__main__':
    unittest.main()
