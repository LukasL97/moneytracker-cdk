export const awsSdkPromiseResponse = jest.fn().mockReturnValue(Promise.resolve(true))

const scanFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))

const putFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))

const deleteFn = jest.fn().mockImplementation(() => ({ promise: awsSdkPromiseResponse }))

class DocumentClient {
  scan = scanFn
  put = putFn
  delete = deleteFn
  service = {
    customizeRequests(_: any) {
    }
  }
}

export const DynamoDB = {
  DocumentClient
}