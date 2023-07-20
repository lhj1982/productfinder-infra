#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import config from '../config';
import { ProductFinderInfraStack } from '../lib/productfinder-infra-stack';

const app = new cdk.App();
// role stack
new ProductFinderInfraStack(app, `launch-productfinder-infra-stack`, config);
