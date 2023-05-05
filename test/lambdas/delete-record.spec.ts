import {awsSdkPromiseResponse, DynamoDB} from '../__mocks__/aws-sdk'
import {deleteRecordEvent, record1} from '../data/test-data'
import {deleteRecord} from '../../src/lambdas/delete-record'
import {APIGatewayProxyStructuredResultV2} from 'aws-lambda/trigger/api-gateway-proxy'

describe('delete-record', () => {

  const db = new DynamoDB.DocumentClient()

  process.env.DYNAMODB_TABLE = 'test-table'

  it('should delete a record with a given ID and return 202', async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({
      Attributes: record1
    }))

    const result = await deleteRecord(deleteRecordEvent) as APIGatewayProxyStructuredResultV2

    expect(result.statusCode).toEqual(202)

    expect(db.delete).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: {
        'id': '33ebe2e4-b29e-4326-9b77-f4acf16249c2'
      },
      ReturnValues: 'ALL_OLD'
    })
  })

  it('should return 404 if the deleted record ID is not in the DB', async () => {
    awsSdkPromiseResponse.mockReturnValueOnce(Promise.resolve({}))

    const result = await deleteRecord(deleteRecordEvent) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('Did not find record with id 33ebe2e4-b29e-4326-9b77-f4acf16249c2')
    expect(result.statusCode).toEqual(404)

    expect(db.delete).toHaveBeenCalledWith({
      TableName: 'test-table',
      Key: {
        'id': '33ebe2e4-b29e-4326-9b77-f4acf16249c2'
      },
      ReturnValues: 'ALL_OLD'
    })
  })

  it('should return 400 when the ID is missing in the request', async () => {
    const eventWithoutId = {
      ...deleteRecordEvent,
      rawPath: '/path/to/resource',
      pathParameters: {}
    }

    const result = await deleteRecord(eventWithoutId) as APIGatewayProxyStructuredResultV2

    expect(result.body).toEqual('id is missing')
    expect(result.statusCode).toEqual(400)
  })
})