import {awsSdkPromiseResponse, DynamoDB} from '../__mocks__/aws-sdk'
import {getRecords} from '../../src/lambdas/get-records'
import {APIGatewayProxyStructuredResultV2} from 'aws-lambda/trigger/api-gateway-proxy'
import {getRecordsEvent, record1, record2} from '../data/test-data'

describe('get-records', () => {

  const db = new DynamoDB.DocumentClient()

  process.env.DYNAMODB_TABLE = 'test-table'
  process.env.DYNAMODB_INDEX_USER = 'test-index-user'

  it('should return 200 and all records from DB', async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({
      Count: 2,
      Items: [record1, record2]
    }))

    const result = await getRecords(getRecordsEvent) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual(JSON.stringify([record1, record2]))
    expect(result.statusCode).toEqual(200)

    expect(db.scan).toHaveBeenCalledWith({
      TableName: 'test-table',
      IndexName: 'test-index-user',
      FilterExpression: '#user = :user',
      ExpressionAttributeNames: { '#user': 'user' },
      ExpressionAttributeValues: { ':user': 'user' }
    })
  })

  it('should return 404 when no records for user in DB', async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({
      Count: 0,
      Items: []
    }))

    const result = await getRecords(getRecordsEvent) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('Did not find any records for user user')
    expect(result.statusCode).toEqual(404)
  })
})