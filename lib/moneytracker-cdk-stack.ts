import {Duration, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib'
import {Construct} from 'constructs'
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import {Tracing} from 'aws-cdk-lib/aws-lambda'
import * as path from 'path'
import {ApiKeySourceType, LambdaIntegration, RestApi} from 'aws-cdk-lib/aws-apigateway'
import {AttributeType, BillingMode, Table} from 'aws-cdk-lib/aws-dynamodb'
import {PolicyStatement} from 'aws-cdk-lib/aws-iam'
import {BackupPlan, BackupResource} from 'aws-cdk-lib/aws-backup'

export class MoneytrackerCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const recordsTable = new Table(this, 'records-store', {
      tableName: 'records',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY
    })

    const recordsTableUserIndexName = 'records-store-user-index'
    recordsTable.addGlobalSecondaryIndex({
      indexName: recordsTableUserIndexName,
      partitionKey: {
        name: 'user',
        type: AttributeType.STRING
      }
    })

    const recordsTableBackup = BackupPlan.daily35DayRetention(this, 'records-backup-plan')
    recordsTableBackup.addSelection('records-backup-selection', {
      resources: [
        BackupResource.fromDynamoDbTable(recordsTable)
      ]
    })

    const recordLambdaProps = {
      projectRoot: '..',
      depsLockFilePath: '../package-lock.json',
      memorySize: 128,
      timeout: Duration.seconds(5),
      runtime: lambda.Runtime.NODEJS_16_X,
      environment: {
        DYNAMODB_TABLE: recordsTable.tableName,
        DYNAMODB_INDEX_USER: recordsTableUserIndexName
      },
      tracing: Tracing.ACTIVE
    }

    const getRecords = new NodejsFunction(this, 'get-records', {
      handler: 'getRecords',
      entry: path.join(__dirname, '/../src/lambdas/get-records.ts'),
      ...recordLambdaProps
    })
    getRecords.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:Scan'],
        resources: [recordsTable.tableArn]
      })
    )

    const putRecord = new NodejsFunction(this, 'put-record', {
      handler: 'putRecord',
      entry: path.join(__dirname, '/../src/lambdas/put-record.ts'),
      ...recordLambdaProps
    })
    putRecord.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:PutItem'],
        resources: [recordsTable.tableArn]
      })
    )

    const deleteRecord = new NodejsFunction(this, 'delete-record', {
      handler: 'deleteRecord',
      entry: path.join(__dirname, '/../src/lambdas/delete-record.ts'),
      ...recordLambdaProps
    })
    deleteRecord.addToRolePolicy(
      new PolicyStatement({
        actions: ['dynamodb:DeleteItem'],
        resources: [recordsTable.tableArn]
      })
    )

    const api = new RestApi(this, 'api', {
      restApiName: 'records service',
      apiKeySourceType: ApiKeySourceType.HEADER,
      deployOptions: {
        tracingEnabled: true
      }
    })
    const recordsResource = api.root.addResource('records', {
      defaultMethodOptions: {
        apiKeyRequired: true
      }
    })
    const recordsResourceId = recordsResource.addResource('{id}')
    recordsResource.addMethod('GET', new LambdaIntegration(getRecords))
    recordsResource.addMethod('PUT', new LambdaIntegration(putRecord))
    recordsResourceId.addMethod('DELETE', new LambdaIntegration(deleteRecord))

    const apiKey = api.addApiKey('api-key', {
      apiKeyName: 'records-service-api-key'
    })
    const apiUsagePlan = api.addUsagePlan('api-usage-plan', {
      name: 'records-service-api-usage-plan',
      apiStages: [{
        api: api,
        stage: api.deploymentStage
      }]
    })
    apiUsagePlan.addApiKey(apiKey)
  }
}
