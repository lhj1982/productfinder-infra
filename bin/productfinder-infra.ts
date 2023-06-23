#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import config from '../config';
import {ProductFinderRoleStack} from "../lib/productfinder-role-stack";

const app = new cdk.App();
// role stack
new ProductFinderRoleStack(app,
    `ProductFinderRoleStack-${config.AWS_ACCOUNT}-${config.AWS_REGION}`,
    {
      env : {
        account : config.AWS_ACCOUNT,
        region : config.AWS_REGION
      }
    }
);


