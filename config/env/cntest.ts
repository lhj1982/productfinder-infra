module.exports = {
  account: '734176943427',
  region: 'cn-northwest-1',
  oktaAdminRole: 'arn:aws-cn:iam::734176943427:role/NIKE.SSO.AdminRole',
  oscarApiArn: 'arn:aws-cn:execute-api:*:693031048477:*',
  glue: {
    jdbcConnectionUrl: 'jdbc:mysql://bot-fairness-analyze.cfvoryi8njkh.rds.cn-northwest-1.amazonaws.com.cn:3306/launch_bot_users',
    username: 'admin',
    password: 'Botfaire2022',
    connection: {
      availabilityZone: 'cn-northwest-1a',
      securityGroupIdList: ['sg-0c910dea633c5b2d9'],
      subnetId: 'subnet-07d67d2fece2fc924',
    }
  }
};
