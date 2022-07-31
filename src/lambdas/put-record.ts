import {DynamoDB} from 'aws-sdk'
import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {StatusCodes} from 'http-status-codes'
import {isRecord} from '../model/Record'
import {v4 as uuidv4} from 'uuid'

const db = new DynamoDB.DocumentClient()

export async function putRecord(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  if (!event.body) {
    return {
      body: 'body is missing',
      statusCode: StatusCodes.BAD_REQUEST
    }
  } else {
    const record = JSON.parse(event.body)
    if (!isRecord(record)) {
      return {
        body: 'body is not a record',
        statusCode: StatusCodes.BAD_REQUEST
      }
    } else {
      if (!record.id) {
        record.id = uuidv4()
      }
      return db.put({
        TableName: process.env.DYNAMODB_TABLE!!,
        Item: record
      }).promise().then(result => {
        console.log(result.$response.data)
        return {
          body: record.id,
          statusCode: StatusCodes.OK
        }
      })
    }
  }
}
