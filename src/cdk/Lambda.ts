import { Construct, Duration } from "@aws-cdk/core";
import {
  RestApi,
  LambdaIntegration,
  AuthorizationType,
  CfnAuthorizer
} from "@aws-cdk/aws-apigateway";
import { Function, Runtime, AssetCode } from "@aws-cdk/aws-lambda";
import {
  Role,
  ServicePrincipal,
  PolicyDocument,
  PolicyStatement,
  Effect,
  ManagedPolicy
} from "@aws-cdk/aws-iam";
import * as path from "path";
import { addCorsOptions } from "./cors";
import { DYNAMODB_TABLENAME } from "./constants";

interface Props {
  restApi: RestApi;
  //authorizer: CfnAuthorizer
}

export class Lambda extends Construct {
  constructor(parent: Construct, id: string, private props: Props) {
    super(parent, id);
    this.create();
  }

  private create() {
    const role = new Role(this, "Role", {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      inlinePolicies: {
        dynamoDB: new PolicyDocument({
          statements: [
            new PolicyStatement({
              actions: ["dynamodb:PutItem", "dynamodb:GetItem"],
              resources: [`arn:aws:dynamodb:*:*:table/${DYNAMODB_TABLENAME}`],
              effect: Effect.ALLOW
            })
          ]
        })
      },
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaBasicExecutionRole"
        ),
        ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        )
      ]
    });

    //Test Lambda
    const handler = new Function(this, "test-webpack", {
      runtime: Runtime.NODEJS_12_X,
      handler: "app.handler",
      timeout: Duration.minutes(1),
      role,
      code: AssetCode.fromAsset(path.join(__dirname, "../..", "dist/test")),
      environment: {
        DYNAMODB_TABLENAME: DYNAMODB_TABLENAME
      }
    });

    handler.addPermission("ApiGatewayInvocation", {
      action: "lambda:InvokeFunction",
      principal: new ServicePrincipal("apigateway.amazonaws.com")
    });

    //Test-Put Lambda
    const handler_test_put = new Function(this, "test-put-webpack", {
      runtime: Runtime.NODEJS_12_X,
      handler: "app.handler",
      timeout: Duration.minutes(1),
      role,
      code: AssetCode.fromAsset(path.join(__dirname, "../..", "dist/test-put")),
      environment: {
        DYNAMODB_TABLENAME: DYNAMODB_TABLENAME
      }
    });

    handler_test_put.addPermission("ApiGatewayInvocation", {
      action: "lambda:InvokeFunction",
      principal: new ServicePrincipal("apigateway.amazonaws.com")
    });

    //Create resources
    const test = this.props.restApi.root.addResource("test");

    //Add CORS to resources
    addCorsOptions(test);

    //Create Method in API Gateway with the Lambda attached
    test.addMethod(
      "GET",
      new LambdaIntegration(handler)
      //, {
      //authorizationType: AuthorizationType.CUSTOM
      // authorizer: { authorizerId: this.props.authorizer.ref }
      //}
    );

    test.addMethod(
        "PUT",
        new LambdaIntegration(handler_test_put)
        //, {
        //authorizationType: AuthorizationType.CUSTOM
        // authorizer: { authorizerId: this.props.authorizer.ref }
        //}
      );

  }
}
