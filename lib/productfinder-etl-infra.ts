import { aws_glue as glue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ArnPrincipal, CompositePrincipal, Policy, PolicyStatement, Role, IRole, ServicePrincipal, ManagedPolicy } from 'aws-cdk-lib/aws-iam';
export class ProductFinderETLInfra extends Construct {
    declare role: IRole;
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
    ) {
        super(scope, id);
        //policy with all policy statement of launch product finder
        const policies = [
            //sns policy
            new Policy(this, 'launch-productfinder-ddb-policy', {
                policyName: 'launch-productfinder-ddb-policy',
                statements: [
                    new PolicyStatement({
                        actions: [
                            'dynamodb:DescribeTable',
                            'dynamodb:Scan'
                        ],
                        resources: [`arn:aws-cn:dynamodb:*:${config.account}:table/launch-productfinder-products`],
                    }),
                ],
            })
        ];
        //role
        this.role = new Role(this, 'launch-productfinder-etl-role', {
            roleName: 'launch-productfinder-etl-role',
            assumedBy: new CompositePrincipal(
                new ServicePrincipal('glue.amazonaws.com')
            ),
            description: 'the iam Role of launch-productfinder-etl-scheduler',
        });
        // add policy to role
        policies.forEach((policy) => {
            this.role.attachInlinePolicy(policy);
        });
        this.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSGlueServiceRole'));


        // create glue connection
        const cfnConnection = new glue.CfnConnection(this, 'launch-productfinder-etl-glue-connection', {
            catalogId: config.account,
            connectionInput: {
                connectionType: 'JDBC',

                // the properties below are optional
                connectionProperties: {
                    JDBC_CONNECTION_URL: config.glue.jdbcConnectionUrl,
                    USERNAME: config.glue.username,
                    PASSWORD: config.glue.password,
                    JDBC_ENFORCE_SSL: false
                },
                description: 'launch productfinder etl glue connection',
                name: 'launch-productfinder-etl',
                physicalConnectionRequirements: {
                    availabilityZone: config.glue.connection.availabilityZone,
                    securityGroupIdList: config.glue.connection.securityGroupIdList,
                    subnetId: config.glue.connection.subnetId,
                }
            },
        });
    }

    getRole(): IRole {
        return this.role;
    }
}
