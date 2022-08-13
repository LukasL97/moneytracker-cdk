import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {withErrorMapping} from '../errors/error-helpers'
import {BadRequestError} from '../errors/BadRequestError'
import {RecordNotFoundError} from '../errors/RecordNotFoundError'
import {accepted} from '../utils/responses'
import {db} from '../utils/db'

export async function deleteRecord(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return withErrorMapping(async () => {
    const id = event.pathParameters?.['id']
    if (!id) {
      throw new BadRequestError('id is missing')
    }
    return db.delete({
      TableName: process.env.DYNAMODB_TABLE!!,
      Key: {
        id
      },
      ReturnValues: 'ALL_OLD'
    }).promise().then(result => {
      if (result.Attributes) {
        return accepted()
      } else {
        throw new RecordNotFoundError(id)
      }
    })
  })
}