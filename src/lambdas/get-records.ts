import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {withErrorMapping} from '../errors/error-helpers'
import {BadRequestError} from '../errors/BadRequestError'
import {NoRecordsForUserError} from '../errors/NoRecordsForUserError'
import {ok} from '../utils/responses'
import {db} from '../utils/db'

export async function getRecords(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return withErrorMapping(async () => {
    const user = event.queryStringParameters?.['user']
    if (!user) {
      throw new BadRequestError('user is missing')
    }
    return db.scan({
      TableName: process.env.DYNAMODB_TABLE!!,
      FilterExpression: '#user = :user',
      ExpressionAttributeNames: { '#user': 'user' },
      ExpressionAttributeValues: { ':user': user }
    }).promise().then(result => {
      if (result.Count && result.Count > 0) {
        return ok(JSON.stringify(result.Items))
      } else {
        throw new NoRecordsForUserError(user)
      }
    })
  })
}


