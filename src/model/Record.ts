import {aws_ram} from 'aws-cdk-lib'

export interface Record {
  user: string
  title: string
  price: number
  category: string
  date: string
  id?: string
}

export function isRecord(arg: any): arg is Record {
  return arg &&
    arg.user && typeof(arg.user) == 'string' &&
    arg.title && typeof(arg.title) == 'string' &&
    arg.price && typeof(arg.price) == 'number' &&
    arg.category && typeof(arg.category) == 'string' &&
    arg.date && typeof(arg.date) == 'string' &&
    (!arg.id || typeof(arg.id) == 'string')
}