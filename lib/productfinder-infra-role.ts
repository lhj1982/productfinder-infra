import {Construct} from "constructs";
import {CompositePrincipal, Policy, PolicyStatement, Role, ServicePrincipal} from "aws-cdk-lib/aws-iam";
import config from "../config";
import {CfnOutput} from "aws-cdk-lib";

export class ProductFinderRole extends Construct {
    constructor(scope: Construct, id:string) {
        super(scope, id);
        //policy with all policy statement of launch product finder
        const policies = [
            //sns policy
            new Policy(this, 'launchProductFinderSnsPolicy', {
                policyName: 'launch-productfinder-sns-policy',
                statements: [
                    new PolicyStatement({
                        actions: ['sns:Publish'],
                        resources: [`arn:aws-cn:sns:${config.AWS_REGION}:${config.AWS_ACCOUNT}:launch-productfinder-scheduler-topic`]
                    })
                ]
            }),
            //sqs policy
            new Policy(this, 'launchProductFinderSqsPolicy', {
                policyName: 'launch-productfinder-sqs-policy',
                statements: [
                    new PolicyStatement({
                        actions: [
                            'sqs:*'
                        ],
                        resources: [`arn:aws-cn:sqs:${config.AWS_REGION}:${config.AWS_ACCOUNT}:launch-productfinder-scheduler-queue`]
                    })
                ]
            }),
            //lambda policy
            new Policy(this, 'launchProductFinderLambdaPolicy', {
                policyName: 'launch-productfinder-lambda-policy',
                statements: [
                    new PolicyStatement({
                        actions: ['lambda:InvokeFunction'],
                        resources: [`arn:aws-cn:lambda:${config.AWS_REGION}:${config.AWS_ACCOUNT}:function:*launch-productfinder*`]
                    })
                ]
            }),
            //dynamodb policy
            new Policy(this, 'launchProductFinderDynamodbPolicy', {
                policyName: 'launch-productfinder-dynamodb-policy',
                statements: [
                    new PolicyStatement({
                        actions: [
                            "dynamodb:DescribeTable",
                            "dynamodb:GetItem",
                            "dynamodb:GetRecords",
                            "dynamodb:Query",
                            "dynamodb:PutItem",
                            "dynamodb:UpdateItem",
                            "dynamodb:Scan",
                            "dynamodb:BatchGetItem",
                            "dynamodb:BatchWriteItem",
                            "dynamodb:DeleteItem"
                        ],
                        resources: [`arn:aws-cn:dynamodb:${config.AWS_REGION}:${config.AWS_ACCOUNT}:table/launch-productfinder*`]
                    }),
                ]
            }),
            //oscar execute api policy
            new Policy(this, 'launchProductFinderOscarPolicy', {
                policyName: 'launch-productfinder-oscar-policy',
                statements: [
                    new PolicyStatement({
                        actions: ['execute-api:Invoke'],
                        resources: [`${config.OSCAR_API_ARN}`]
                    })
                ]
            }),
            //step function
            new Policy(this, 'launchProductStepFunctionPolicy', {
                policyName: 'launch-productfinder-stepFunction-policy',
                statements: [
                    new PolicyStatement({
                        actions: ['states:StartExecution'],
                        resources: [`arn:aws-cn:states:${config.AWS_REGION}:${config.AWS_ACCOUNT}:stateMachine:launch-productfinder*`]
                    })
                ]
            }),
        ];
        //role
        const role = new Role(this, 'launchProductFinderRole', {
            roleName : 'launch-productfinder-role',
            assumedBy : new CompositePrincipal(
                new ServicePrincipal('sns.amazonaws.com'),
                new ServicePrincipal('sqs.amazonaws.com'),
                new ServicePrincipal('lambda.amazonaws.com'),
                new ServicePrincipal('dynamodb.amazonaws.com'),
                new ServicePrincipal('states.amazonaws.com'),
            ),
            description: 'the iam Role of launch-productfinder-scheduler and launch-productfinder-consume'
        });
        // add policy to role
        policies.forEach(policy => {
            role.attachInlinePolicy(policy);
        });
        new CfnOutput(this, 'ProductFinderRoleArn', {
            value: role.roleArn,
            description: 'The arn of launch product finder role',
            exportName: 'ProductFinderRoleArn',
        });
    }
}
