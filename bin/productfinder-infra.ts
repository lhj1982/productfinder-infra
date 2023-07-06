#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import config from '../config';
import {ProductFinderInfraStack} from "../lib/productfinder-infra-stack";

const app = new cdk.App();
// role stack
new ProductFinderInfraStack(app,
    `launchProductFinderInfraStack-${config.AWS_ACCOUNT}-${config.AWS_REGION}`,
    {
      env : {
        account : config.AWS_ACCOUNT,
        region : config.AWS_REGION
      }
    }
);


