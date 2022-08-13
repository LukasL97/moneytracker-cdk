import {APIGatewayProxyEventV2, APIGatewayProxyResultV2} from 'aws-lambda'
import {isRecord} from '../model/Record'
import {v4 as uuidv4} from 'uuid'
import {BadRequestError} from '../errors/BadRequestError'
import {withErrorMapping} from '../errors/error-helpers'
import {ok} from '../utils/responses'
import {db} from '../utils/db'

export async function putRecord(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  return withErrorMapping(async () => {
    if (!event.body) {
      throw new BadRequestError('body is missing')
    }
    const record = JSON.parse(event.body)
    if (!isRecord(record)) {
      throw new BadRequestError('body is not a Record')
    }
    if (!record.id) {
      record.id = uuidv4()
    }
    return db.put({
      TableName: process.env.DYNAMODB_TABLE!!,
      Item: record
    }).promise().then(() => {
      return ok(record.id!!)
    })
  })
}
