import {Duration, Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import {LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam'

export class MoneytrackerCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const recordsTable = new Table(this, 'records-store', {
      tableName: 'records',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST
    })

    const getRecords = new NodejsFunction(this, 'get-records', {
      memorySize: 128,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'getRecords',
      entry: path.join(__dirname, '/../src/lambdas/get-records.ts'),
      environment: {
        DYNAMODB_TABLE: recordsTable.tableName
      }
    })

    getRecords.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Scan'],
        resources: [recordsTable.tableArn]
      })
    )

    const api = new RestApi(this, 'api', {
      restApiName: 'records service'
    })
    const recordsApi = api.root.addResource('records')
    recordsApi.addMethod('GET', new LambdaIntegration(getRecords))
  }
}
