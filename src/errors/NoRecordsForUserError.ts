import {BaseError} from './BaseError'
import {StatusCodes} from 'http-status-codes'

export class NoRecordsForUserError extends BaseError {
  statusCode = StatusCodes.NOT_FOUND

  constructor(user: string) {
    super(`Did not find any records for user ${user}`)
  }
}