import { Construct, Duration } from "@aws-cdk/core";
import { RestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect, ManagedPolicy } from '@aws-cdk/aws-iam';
// import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import * as path from 'path'
import { addCorsOptions } from './cors';

interface Props {
    restApi: RestApi
    //authorizer: CfnAuthorizer
}

export class Lambda extends Construct {
    constructor(parent: Construct, id: string, private props: Props) {
        super(parent, id)
        this.create()
    }
    
    private create() {      
        const role = new Role(this, 'Role', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
            ]
        });

        //Test Lambda
        const handler = new Function(this, 'test-webpack', {
            runtime: Runtime.NODEJS_10_X,
            handler: 'test.handler',
            timeout: Duration.minutes(1),
            role,
            code: AssetCode.fromAsset(path.join(__dirname, '../..', 'lib/test')),
        })
        
        handler.addPermission('ApiGatewayInvocation', {
            action: 'lambda:InvokeFunction',
            principal: new ServicePrincipal('apigateway.amazonaws.com')
        })
        
        //Create resources
        const test = this.props.restApi.root.addResource('test');

        //Add CORS to resources
        addCorsOptions(test)

        //Create Method in API Gateway with the Lambda attached
        const method = test.addMethod('GET', new LambdaIntegration(handler)
        //, { 
            //authorizationType: AuthorizationType.CUSTOM
            // authorizer: { authorizerId: this.props.authorizer.ref } 
        //}
        )
    }
}
