import {Record} from '../../src/model/Record'
import {APIGatewayProxyEventV2} from 'aws-lambda'

export const record1: Record = {
  user: 'user',
  title: 'Test1',
  price: 1.99,
  category: 'Category',
  date: '2023-04-14T18:32:28+02:00[Europe/Amsterdam]',
  id: '33ebe2e4-b29e-4326-9b77-f4acf16249c2'
}

export const record2: Record = {
  user: 'user',
  title: 'Test2',
  price: 3.33,
  category: 'Category',
  date: '2022-08-16T07:17:49+02:00[Europe/Berlin]',
  id: 'b57c111b-475b-454a-bc13-972ac73968e6'
}

export const recordWithoutId: Record = {
  user: 'user',
  title: 'Test1',
  price: 1.99,
  category: 'Category',
  date: '2023-04-14T18:32:28+02:00[Europe/Amsterdam]'
}

export const getRecordsEvent: APIGatewayProxyEventV2 = {
  version: '2.0',
  routeKey: '$default',
  rawPath: '/path/to/resource',
  rawQueryString: 'user=user',
  headers: {},
  queryStringParameters: {
    user: 'user'
  },
  requestContext: {
    accountId: '123123123123',
    apiId: 'api-id',
    domainName: 'id.domain.de',
    domainPrefix: 'id',
    http: {
      method: 'GET',
      path: '/path/to/resource',
      protocol: 'HTTP/1.1',
      sourceIp: '123.123.123.123/32',
      userAgent: 'agent'
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390
  },
  isBase64Encoded: true
}

export const putRecordEvent: APIGatewayProxyEventV2 = {
  version: '2.0',
  routeKey: '$default',
  rawPath: '/path/to/resource',
  rawQueryString: '',
  body: JSON.stringify(recordWithoutId),
  headers: {},
  requestContext: {
    accountId: '123123123123',
    apiId: 'api-id',
    domainName: 'id.domain.de',
    domainPrefix: 'id',
    http: {
      method: 'PUT',
      path: '/path/to/resource',
      protocol: 'HTTP/1.1',
      sourceIp: '123.123.123.123/32',
      userAgent: 'agent'
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390
  },
  isBase64Encoded: true
}

export const deleteRecordEvent: APIGatewayProxyEventV2 = {
  version: '2.0',
  routeKey: '$default',
  rawPath: '/path/to/resource/33ebe2e4-b29e-4326-9b77-f4acf16249c2',
  pathParameters: {
    'id': '33ebe2e4-b29e-4326-9b77-f4acf16249c2'
  },
  rawQueryString: '',
  headers: {},
  requestContext: {
    accountId: '123123123123',
    apiId: 'api-id',
    domainName: 'id.domain.de',
    domainPrefix: 'id',
    http: {
      method: 'DELETE',
      path: '/path/to/resource',
      protocol: 'HTTP/1.1',
      sourceIp: '123.123.123.123/32',
      userAgent: 'agent'
    },
    requestId: 'id',
    routeKey: '$default',
    stage: '$default',
    time: '12/Mar/2020:19:03:58 +0000',
    timeEpoch: 1583348638390
  },
  isBase64Encoded: true
}