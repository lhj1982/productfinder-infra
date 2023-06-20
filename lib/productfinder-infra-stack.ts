import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Table, AttributeType, BillingMode } from 'aws-cdk-lib/aws-dynamodb';
import config from '../config';

export class ProductFinderInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // IAM role for oscar invoke
    const assumeRole = new iam.Role(this, 'LaunchProductFinderServiceAssumeRole', {
      roleName: config.ASSUMED_ROLE_NAME,
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('lambda.amazonaws.com'),
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.ArnPrincipal(`${config.OKTA_ADMIN_ROLE}`),
      ),
      description: 'Role that allow to generate oscar token',
    });

    new iam.ManagedPolicy(this, 'LaunchProductFinderOscarTokenGenerationPolicy', {
      description: 'Policy to invoke oscar lambda',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['execute-api:Invoke'],
          resources: [`${config.OSCAR_API_ARN}`],
        }),
      ],
      roles: [assumeRole],
    });

    new iam.ManagedPolicy(this, 'LaunchProductFinderCloudwatchPolicy', {
      description: 'Policy to manage cloudwatch',
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          actions: ['cloudwatch:PutMetricData'],
          resources: ['*'],
        }),
      ],
      roles: [assumeRole],
    });

    // dynamodb tables
    const tableName = 'productFinder-products';
    const productTable = new Table(this, 'ProductFinderProductsTable', {
      tableName: tableName,
      partitionKey: {
        name: `styleColor`,
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    const allowedUsersTableName = 'productFinder-allowedUsers';
    const allowedUsersTable = new Table(this, 'ProductFinderAllowedUsersTable', {
      tableName: allowedUsersTableName,
      partitionKey: {
        name: `userId`,
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // Generate output
    new cdk.CfnOutput(this, 'ProductFinderAllowedUsersTableArn', {
      value: allowedUsersTable.tableArn,
      description: 'The table arn',
      exportName: 'ProductFinderAllowedUsersTableArn',
    });
    new cdk.CfnOutput(this, 'ProductFinderProductsTableArn', {
      value: productTable.tableArn,
      description: 'The table arn',
      exportName: 'ProductFinderProductsTableArn',
    });
    new cdk.CfnOutput(this, 'LaunchProductFinderServiceAssumeRoleName', {
      value: assumeRole.roleName,
      description: 'The name of assume service role',
    });
  }
}
