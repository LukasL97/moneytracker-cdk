import {APIGatewayProxyResultV2} from 'aws-lambda'
import {BaseError} from './BaseError'
import {StatusCodes} from 'http-status-codes'

export async function withErrorMapping(f: () => Promise<APIGatewayProxyResultV2>): Promise<APIGatewayProxyResultV2> {
  return f().catch(error => {
    if (error instanceof BaseError) {
      return error.toResponse()
    } else {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR
      }
    }
  })
}