import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {ProductFinderRole} from "./productfinder-infra-role";

export class ProductFinderInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    new ProductFinderRole(this, 'launchProductFinderRoleConstruct');
  }
}
