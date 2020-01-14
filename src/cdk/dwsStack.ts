import cdk = require('@aws-cdk/core');
import { RestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Lambda } from './Lambda';
import { addCorsOptions } from './cors';

export class dwsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new RestApi(this, 'dws-api');
    //const test =  restApi.root.addResource('test');
    //const testMethod = test.addMethod('GET');

    //Add Mock Integrations
    addCorsOptions(restApi.root)


    //const Authorizer = new DwsAuthorizer(this, 'DwsAuthorizer', { restApi })
    
    //Resource, method, lambda in below class
    new Lambda(this, 'DwsLambda', {
        restApi,
        //authorizer: DwsAuthorizer.authorizer
    })
  }
}