import {BaseError} from './BaseError'
import {StatusCodes} from 'http-status-codes'

export class BadRequestError extends BaseError {
  statusCode = StatusCodes.BAD_REQUEST
}