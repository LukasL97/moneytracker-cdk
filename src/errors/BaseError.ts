import {APIGatewayProxyResultV2} from 'aws-lambda'

export abstract class BaseError extends Error {

  protected readonly msg: string

  protected abstract readonly statusCode: number

  constructor(msg: string) {
    super(msg)
    this.msg = msg
  }

  toResponse(): APIGatewayProxyResultV2 {
    return {
      body: this.msg,
      statusCode: this.statusCode
    }
  }
}