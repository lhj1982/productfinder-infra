#!groovy
@Library('cicd-pipeline') _

//use the docker image from uls team for now as it's node16
def buildImage = 'artifactory.nike.com:9001/us/uls-bmx-build:latest'

def deploymentEnvironmentTags = [
    cntest: [
        'nike-environment': 'cntest',
    ],
    cnprod: [
        'nike-environment': 'cnprod',
    ]
]

def deployCommandAws = [
    cntest: [
        roleAccount: '734176943427',
        role: 'launch-productfinder-bmx-deploy-role',
        region: 'cn-northwest-1',
    ],
    cnprod: [
        roleAccount: '734147128161',
        role: 'launch-productfinder-bmx-deploy-role',
        region: 'cn-northwest-1',
    ]
]

def config = [
    usePraDispatch: false,
    buildFlow: [
        DEPLOY_TEST: ['Build'],
        DEPLOY_PROD: ['Build'],
    ],
    branchMatcher: [
        DEPLOY_TEST: ['main'],
        BUILD_ONLY: ['^(?!main$).*$'],
    ],
    qma                  : [configFile: 'quality-config.yaml'],
    versionStrategy: 'packageJson',
    tags                 : [
            'Name'                 : 'launch-productfinder-infra',
            'classification'       : 'Bronze',
            'email': 'yan.zhou2@nike.com',
            'owner': 'launch',
            'nike-application'     : 'launch-productfinder-infra',
            'nike-department'      : 'platform engineering - launch',
            'nike-domain'          : 'launch-productfinder',
    ]
    notify: [
        slack: [
            channel: '#launch-productfinder-deploy',
            onCondition: ['Build Start', 'Confirm Promote', 'Failure', 'Success', 'Unstable'],
        ]
    ],
    deploymentEnvironment:  [
        'cntest': [
            deployFlow: [
                DEPLOY_TEST: ['Deploy'],
            ],
            cloudEnvironment: 'test',
            tags: deploymentEnvironmentTags.cntest,
            deployCommand: [
                aws: deployCommandAws.cntest,
                image: buildImage,
                cmd: 'npm install && npm run bmx:cntest',
            ]
        ],
        'cnprod': [
            deployFlow: [
                DEPLOY_PROD: ['Deploy'],
            ],
            cloudEnvironment: 'prod',
            tags: deploymentEnvironmentTags.cnprod,
            deployCommand: [
                aws: deployCommandAws.cnprod,
                image: buildImage,
                cmd: 'npm install && npm run bmx:cnprod',
            ]
        ]
    ]
]

genericDeployPipeline(config)
