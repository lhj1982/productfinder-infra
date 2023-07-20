import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProductFinderRole } from './productfinder-infra-role';

export class ProductFinderInfraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    config: { account: string; region: string; oktaAdminRole: string; oscarApiArn: string },
    props?: cdk.StackProps,
  ) {
    super(scope, id, props);
    new ProductFinderRole(this, 'launch-productfinder-role-construct', config);
  }
}
