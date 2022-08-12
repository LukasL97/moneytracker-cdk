import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {StatusCodes} from 'http-status-codes'
import {DynamoDB} from 'aws-sdk'

const db = new DynamoDB.DocumentClient()

export async function deleteRecord(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const id = event.queryStringParameters?.['id']
  if (!id) {
    return {
      body: 'id is missing',
      statusCode: StatusCodes.BAD_REQUEST
    }
  } else {
    return db.delete({
      TableName: process.env.DYNAMODB_TABLE!!,
      Key: {
        id
      }
    }).promise().then(() => {
      return {
        statusCode: StatusCodes.ACCEPTED
      }
    })
  }
}