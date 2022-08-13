import {BaseError} from './BaseError'
import {StatusCodes} from 'http-status-codes'

export class RecordNotFoundError extends BaseError {
  statusCode = StatusCodes.NOT_FOUND

  constructor(id: string) {
    super(`Did not find record with id ${id}`)
  }
}