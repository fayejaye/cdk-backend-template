import { Construct } from "@aws-cdk/core";
import { RestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect, ManagedPolicy } from '@aws-cdk/aws-iam';
// import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import * as path from 'path'

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

        const handler = new Function(this, 'CreateRepo', {
            runtime: Runtime.NODEJS_10_X,
            handler: 'lib/test.handler',
            role,
            code: AssetCode.fromAsset(path.join(__dirname, '../..', 'dws-backend.zip')),
        })
        
        handler.addPermission('ApiGatewayInvocation', {
            action: 'lambda:InvokeFunction',
            principal: new ServicePrincipal('apigateway.amazonaws.com')
        })
        
        const test = this.props.restApi.root.addResource('test');

        //Create Method in API Gateway with our Lambda attached
        const method = test.addMethod('POST', new LambdaIntegration(handler), { 
            authorizationType: AuthorizationType.CUSTOM
            // authorizer: { authorizerId: this.props.authorizer.ref } 
        })
    }
}
