import { Construct, Duration } from "@aws-cdk/core";
import { RestApi, LambdaIntegration, AuthorizationType, CfnAuthorizer } from '@aws-cdk/aws-apigateway'
import { Function, Runtime, AssetCode } from '@aws-cdk/aws-lambda';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect, ManagedPolicy } from '@aws-cdk/aws-iam';
import { CfnSecret } from '@aws-cdk/aws-secretsmanager';
import * as path from 'path'
import { addCorsOptions } from './cors';
import { PostgreSQLPW_Secret_Name } from './constants'

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

        const secret = new CfnSecret(this,'PostgreSQLPW', {
            name: PostgreSQLPW_Secret_Name,
            secretString: 'REPLACE_ME'
        })

        const role = new Role(this, 'Role', {
            assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
            inlinePolicies: {
                getPostgresSQL : new PolicyDocument({
                    statements: [
                        new PolicyStatement({
                            actions: ['secretsmanager:GetSecretValue'],
                            resources: [secret.ref],
                            effect: Effect.ALLOW
                        })
                    ]
                })
            },
            managedPolicies: [
                ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
            ]
        });

        //Test Lambda
        const handler = new Function(this, 'test-webpack', {
            runtime: Runtime.NODEJS_12_X,
            handler: 'app.handler',
            timeout: Duration.minutes(1),
            role,
            code: AssetCode.fromAsset(path.join(__dirname, '../..', 'dist/test')),
        })

        handler.addPermission('ApiGatewayInvocation', {
            action: 'lambda:InvokeFunction',
            principal: new ServicePrincipal('apigateway.amazonaws.com')
        })

        //Test2Lambda
        const test2 = new Function(this, 'test2-webpack', {
            runtime: Runtime.NODEJS_12_X,
            handler: 'app.handler',
            timeout: Duration.minutes(2),
            role,
            code: AssetCode.fromAsset(path.join(__dirname, '../..', 'dist/test2')),
            environment: {
                PostgreSQLPW_Secret_Name: PostgreSQLPW_Secret_Name
            }
        })

        test2.addPermission('ApiGatewayInvocation', {
            action: 'lambda:InvokeFunction',
            principal: new ServicePrincipal('apigateway.amazonaws.com')
        })

        //Create resources
        const test = this.props.restApi.root.addResource('test');
        const test2resource = test.addResource('test2');

        //Add CORS to resources
        addCorsOptions(test)
        addCorsOptions(test2resource)

        //Create Method in API Gateway with the Lambda attached
        const method = test.addMethod('GET', new LambdaIntegration(handler)
            //, { 
            //authorizationType: AuthorizationType.CUSTOM
            // authorizer: { authorizerId: this.props.authorizer.ref } 
            //}
        )

        const method2 = test2resource.addMethod('GET', new LambdaIntegration(test2)
            //, { 
            //authorizationType: AuthorizationType.CUSTOM
            // authorizer: { authorizerId: this.props.authorizer.ref } 
            //}
        )
    }
}
