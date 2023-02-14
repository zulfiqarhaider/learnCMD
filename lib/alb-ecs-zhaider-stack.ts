import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as ssm from 'aws-cdk-lib/aws-ssm'
import { Stack, StackProps } from 'aws-cdk-lib';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class NetworkZHstack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, "learnCMD-cdk-vpc", {

      ipAddresses: ec2.IpAddresses.cidr("172.1.0.0/20"),
      maxAzs: 3,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "Public",
          subnetType: ec2.SubnetType.PUBLIC
        },
        {
          cidrMask: 24,
          name: "Private-with-NAT",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
        },
        {
          cidrMask: 24,
          name: "Private-secured",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    }
    )

    const s3endpoint = vpc.addGatewayEndpoint("S3Endpoint", {
      service: ec2.GatewayVpcEndpointAwsService.S3,

      // where is the reference of subnet in documentation.
      subnets: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED
        }
      ]
    })

    const dynamoDbEndpoint = vpc.addGatewayEndpoint('DynamoDbEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    })

    const vpcIdParam = new ssm.StringParameter(this, 'mySsmParameter', {
      parameterName: '/workshop/VpcIdzhaider',
      stringValue: vpc.vpcId
    })

    // example resource
    // const queue = new sqs.Queue(this, 'LearncdkClassQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
