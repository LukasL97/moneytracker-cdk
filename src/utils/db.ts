import {DynamoDB} from 'aws-sdk'
import {captureAWSClient} from 'aws-xray-sdk'

export const db = new DynamoDB.DocumentClient()
captureAWSClient((db as any).service)
