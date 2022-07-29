import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {StatusCodes} from 'http-status-codes'
import {Record} from '../model/Record'
import {DynamoDB} from 'aws-sdk'

const db = new DynamoDB.DocumentClient()

export async function getRecords(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const user = event.queryStringParameters?.['user']
  if (!user) {
    return {
      body: 'user is missing',
      statusCode: StatusCodes.BAD_REQUEST
    }
  } else {
    return  db.scan({
      TableName: process.env.DYNAMODB_TABLE!!,
      ExpressionAttributeValues: {
        ':user': {
          S: user
        }
      },
      FilterExpression: 'user = :user'
    }).promise().then(result => {
      return {
        body: JSON.stringify(result.Items),
        statusCode: StatusCodes.OK
      }
    })
  }
}


