import cdk = require('@aws-cdk/core');
import { RestApi, MethodLoggingLevel, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Lambda } from './Lambda';
import { Dynamo } from './Dynamo';
import { addCorsOptions } from './cors';
import { DynamoDB } from 'aws-sdk';

export class dwsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new RestApi(this, 'dws-api',{
      deployOptions: {
      loggingLevel: MethodLoggingLevel.ERROR,
      dataTraceEnabled: true
    }
  });
    //Add Mock Integrations
    addCorsOptions(restApi.root)

    //const Authorizer = new DwsAuthorizer(this, 'DwsAuthorizer', { restApi })
    
    new Lambda(this, 'DwsLambda', {
        restApi,
        //authorizer: DwsAuthorizer.authorizer
    })

    new Dynamo(this, 'DwsDynamo')

  }
}