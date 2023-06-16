import requests
import unittest
import os
import boto3

api_endpoint = os.getenv('DEV_API_ENDPOINT')
api_key = os.getenv('DEV_API_KEY')

db_table_name = 'records'

db_client = boto3.client('dynamodb')


def clear_db():
    result = db_client.scan(TableName=db_table_name)
    print(result['Items'])
    # TODO: clear db


def put_record(record):
    return requests.put(api_endpoint + '/records', json=record, headers={'X-Api-Key': api_key})


def get_records(user):
    return requests.get(api_endpoint + f'/records?user={user}', headers={'X-Api-Key': api_key})


def delete_record(id):
    return requests.delete(api_endpoint + f'/records/{id}', headers={'X-Api-Key': api_key})


class ApiTest(unittest.TestCase):

    def test_put_get_delete_record(self):
        clear_db()

        record = {
            'title': 'record',
            'date': '2022-08-16T07:17:49+02:00[Europe/Berlin]',
            'price': 1337.42,
            'category': 'category',
            'user': 'user'
        }

        put_response = put_record(record)
        self.assertEqual(put_response.status_code, 200)

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


if __name__ == '__main__':
    unittest.main()
