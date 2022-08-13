import {APIGatewayProxyResultV2} from 'aws-lambda'
import {StatusCodes} from 'http-status-codes'

export function ok(body: string): APIGatewayProxyResultV2 {
  return {
    body: body,
    statusCode: StatusCodes.OK
  }
}

export function accepted(): APIGatewayProxyResultV2 {
  return {
    statusCode: StatusCodes.ACCEPTED
  }
}