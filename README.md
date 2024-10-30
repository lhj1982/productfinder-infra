# Welcome to your CDK TypeScript project!


## Prerequisite

 * aws cdk 2+
 * Nodejs 16+
 * NPM 6.13.7
 * typescript
 * gimme_aws_cred

## Configuration

Environment specific configuration is under config folder. Copy development-template.ts and production-template.ts to **development.ts** and **production.ts** respectively, and make changes accordingly.

The configuration list is as follows
```
AWS_ACCOUNT: '734176943427',
AWS_REGION: 'cn-northwest-1',
OSCAR_API_ARN: 'arn:aws-cn:execute-api:*:693031048477:*',
ASSUMED_ROLE_NAME: 'xxx'
SLACK_MESSAGE_HOOK: 'https://hooks.slack.com/services/<slack web hook url>',
```


You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`ProductFinderInfraStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Setup gimme_aws_cred

  * Stack will be deploy to Commerce GC waffleiron account, make sure you have access to both Test and Prod environment with **AdminRole**
  * Open **~/.okta_aws_login_config**, setup two profiles **CommerceGCTest** or **CommerceGCProd**, example
```
[CommerceGCTest]
okta_org_url = https://nike.okta.com
okta_auth_server = aus27z7p76as9Dz0H1t7
client_id = 0oa34x20aq50blCCZ1t7
gimme_creds_server = https://api.sec.nikecloud.com/gimmecreds/accounts
aws_appname = AWS-CN WaffleIron Multi-Account
aws_rolename = arn:aws:iam::<aws accountId>:role/NIKE.SSO.AdminRole
write_aws_creds = True
cred_profile = CommerceGCTest
okta_username = <nike email>
app_url =
resolve_aws_alias = False
include_path = False
preferred_mfa_type = token:software:totp
remember_device = False
aws_default_duration = 3600
device_token =
output_format =

[CommerceGCProd]
okta_org_url = https://nike.okta.com
okta_auth_server = aus27z7p76as9Dz0H1t7
client_id = 0oa34x20aq50blCCZ1t7
gimme_creds_server = https://api.sec.nikecloud.com/gimmecreds/accounts
aws_appname = AWS-CN WaffleIron Multi-Account
aws_rolename = arn:aws:iam::<aws accountId>:role/NIKE.SSO.AdminRole
write_aws_creds = True
cred_profile = CommerceGCProd
okta_username = <nike email>
app_url =
resolve_aws_alias = False
include_path = False
preferred_mfa_type = token:software:totp
remember_device = False
aws_default_duration = 3600
device_token =
output_format =
```


## How to run

 * Run gimme-aws-cred to generate profile for proper environment

Depends on the environment, run command with speicified profile **CommerceGCTest** or **CommerceGCProd**
 ```
 gimme-aws-creds --profile CommerceGCTest
 ```
 * Build source
 ```
 npm run build
 ```
 * Deploy
 ```
npm run deploy:dev
npm run deploy:prod
 ```

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`ProductFinderInfraStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

 make sure there are access key, secret, and region configured in ~/.aws/credentials
