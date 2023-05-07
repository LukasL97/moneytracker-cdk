import {DynamoDB} from '../__mocks__/aws-sdk'
import {putRecord} from '../../src/lambdas/put-record'
import {putRecordEvent, record1} from '../data/test-data'
import {APIGatewayProxyStructuredResultV2} from 'aws-lambda/trigger/api-gateway-proxy'
import * as uuid from '../../src/utils/uuid'

describe('put-record', () => {

  const db = new DynamoDB.DocumentClient()

  process.env.DYNAMODB_TABLE = 'test-table'

  it('should return 200 and a record ID', async () => {
    jest.spyOn(uuid, 'generateUuid').mockReturnValue('33ebe2e4-b29e-4326-9b77-f4acf16249c2')

    const result = await putRecord(putRecordEvent) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('33ebe2e4-b29e-4326-9b77-f4acf16249c2')
    expect(result.statusCode).toEqual(200)

    expect(db.put).toHaveBeenCalledWith({
      TableName: 'test-table',
      Item: record1
    })
  })

  it('should return 400 when the body is not parsable as a json', async () => {
    const eventWithIncorrectBody = {
      ...putRecordEvent,
      body: '{some: nonsense}'
    }

    const result = await putRecord(eventWithIncorrectBody) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('body is not a parsable JSON')
    expect(result.statusCode).toEqual(400)
  })

  it('should return 400 when the body is not a Record', async () => {
    const eventWithIncorrectBody = {
      ...putRecordEvent,
      body: '{"some": "nonsense"}'
    }

    const result = await putRecord(eventWithIncorrectBody) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('body is not a Record')
    expect(result.statusCode).toEqual(400)
  })

  it('should return 400 when the body is missing', async () => {
    const eventWithMissingBody = {
      ...putRecordEvent,
      body: undefined
    }

    const result = await putRecord(eventWithMissingBody) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('body is missing')
    expect(result.statusCode).toEqual(400)
  })
})