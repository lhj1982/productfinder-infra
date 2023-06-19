import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
// import * as s3 from '@aws-cdk/aws-s3';
import config from '../config';

export class ProductFinderInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // const bucket = new s3.Bucket(this, 'ServiceKeyBucket', {
    //   bucketName: config.KEY_BUCKET_NAME
    // });

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
      roles: [assumeRole]
    });

    // new cdk.CfnOutput(this, 'ServiceKeyBucketName', {
    //     value: bucket.bucketName,
    //     description: 'The name of service key bucket',
    //     exportName: 'serviceKeyBucketName',
    //   });
    // new cdk.CfnOutput(this, 'ServiceKeyBucketArn', {
    //     value: bucket.bucketArn,
    //     description: 'The arn of service key bucket',
    //     exportName: 'serviceKeyBucketArn',
    //   });
    new cdk.CfnOutput(this, 'LaunchProductFinderServiceAssumeRoleName', {
      value: assumeRole.roleName,
      description: 'The name of assume service role'
    });
  }
}
