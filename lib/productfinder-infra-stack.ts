import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ProductFinderRole } from './productfinder-infra-role';
import { ProductFinderETLInfra } from './productfinder-etl-infra';

export class ProductFinderInfraStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    config: {
      account: string; region: string; oktaAdminRole: string; oscarApiArn: string,
      glue: {
        jdbcConnectionUrl: string, username: string, password: string,
        connection: { availabilityZone: string, securityGroupIdList: string[], subnetId: string }
      }
    },
    props?: cdk.StackProps,
  ) {
    super(scope, id, props);
    new ProductFinderRole(this, 'launch-productfinder-role-construct', config);
    new ProductFinderETLInfra(this, 'launch-productfinder-etl-infra-construct', config);
  }
}
