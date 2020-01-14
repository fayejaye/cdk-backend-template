import cdk = require('@aws-cdk/core');
import { RestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Lambda } from './Lambda';
import { addCorsOptions } from './cors';

export class dwsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const restApi = new RestApi(this, 'dws-api');
    const test =  restApi.root.addResource('/test');

    //Add Mock Integrations
    addCorsOptions(restApi.root)
    addCorsOptions(test)

    //const Authorizer = new CLIAuthorizer(this, 'CLIAuthorizer', { restApi })
        
    new Lambda(this, 'NewrelicLambda', {
        restApi,
        //authorizer: cliAuthorizer.authorizer
    })
  }
}