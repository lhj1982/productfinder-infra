import { Construct } from 'constructs';
import { ArnPrincipal, CompositePrincipal, Policy, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
export class ProductFinderRole extends Construct {
  constructor(
    scope: Construct,
    id: string,
    config: { account: string; region: string; oktaAdminRole: string; oscarApiArn: string },
  ) {
    super(scope, id);
    //policy with all policy statement of launch product finder
    const policies = [
      //sns policy
      new Policy(this, 'launch-productfinder-sns-policy', {
        policyName: 'launch-productfinder-sns-policy',
        statements: [
          new PolicyStatement({
            actions: ['sns:Publish'],
            resources: [`arn:aws-cn:sns:${config.region}:${config.account}:launch-productfinder*`],
          }),
        ],
      }),
      //sqs policy
      new Policy(this, 'launch-productfinder-sqs-policy', {
        policyName: 'launch-productfinder-sqs-policy',
        statements: [
          new PolicyStatement({
            actions: ['sqs:*'],
            resources: [`arn:aws-cn:sqs:${config.region}:${config.account}:launch-productfinder*`],
          }),
        ],
      }),
      //lambda policy
      new Policy(this, 'launch-productfinder-lambda-policy', {
        policyName: 'launch-productfinder-lambda-policy',
        statements: [
          new PolicyStatement({
            actions: ['lambda:InvokeFunction'],
            resources: [`arn:aws-cn:lambda:${config.region}:${config.account}:function:launch-productfinder*`],
          }),
        ],
      }),
      //dynamodb policy
      new Policy(this, 'launch-productfinder-dynamodb-policy', {
        policyName: 'launch-productfinder-dynamodb-policy',
        statements: [
          new PolicyStatement({
            actions: [
              'dynamodb:DescribeTable',
              'dynamodb:GetItem',
              'dynamodb:GetRecords',
              'dynamodb:Query',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:Scan',
              'dynamodb:BatchGetItem',
              'dynamodb:BatchWriteItem',
              'dynamodb:DeleteItem',
            ],
            resources: [`arn:aws-cn:dynamodb:${config.region}:${config.account}:table/launch-productfinder*`],
          }),
        ],
      }),
      //oscar execute api policy
      new Policy(this, 'launch-productfinder-oscarPolicy', {
        policyName: 'launch-productfinder-oscar-policy',
        statements: [
          new PolicyStatement({
            actions: ['execute-api:Invoke'],
            resources: [`${config.oscarApiArn}`],
          }),
        ],
      }),
      //step function
      new Policy(this, 'launch-productfinder-stepfunction-policy', {
        policyName: 'launch-productfinder-stepfunction-policy',
        statements: [
          new PolicyStatement({
            actions: ['states:StartExecution'],
            resources: [`arn:aws-cn:states:${config.region}:${config.account}:stateMachine:launch-productfinder*`],
          }),
        ],
      }),
      //cloud watch
      new Policy(this, 'Launch-productfinder-cloudwatch-policy', {
        policyName: 'launch-productfinder-cloudwatch-policy',
        statements: [
          new PolicyStatement({
            actions: ['cloudwatch:PutMetricData', 'logs:*'],
            resources: ['*'],
          }),
        ],
      }),
      // kms
      new Policy(this, 'Launch-productfinder-kms-policy', {
        policyName: 'launch-productfinder-kms-policy',
        statements: [
          new PolicyStatement({
            actions: ['kms:Encrypt', 'kms:Decrypt'],
            resources: ['*'],
          }),
        ],
      }),
    ];
    //role
    const role = new Role(this, 'launch-productfinder-role', {
      roleName: 'launch-productfinder-role',
      assumedBy: new CompositePrincipal(
        new ServicePrincipal('sns.amazonaws.com'),
        new ServicePrincipal('sqs.amazonaws.com'),
        new ServicePrincipal('lambda.amazonaws.com'),
        new ServicePrincipal('dynamodb.amazonaws.com'),
        new ServicePrincipal('states.amazonaws.com'),
        new ServicePrincipal('events.amazonaws.com'),
        new ServicePrincipal('logs.amazonaws.com'),
        new ServicePrincipal('ec2.amazonaws.com'),
        new ServicePrincipal('kms.amazonaws.com'),
        new ArnPrincipal(`${config.oktaAdminRole}`),
      ),
      description: 'the iam Role of launch-productfinder-scheduler and launch-productfinder-consume',
    });
    // add policy to role
    policies.forEach((policy) => {
      role.attachInlinePolicy(policy);
    });
  }
}
