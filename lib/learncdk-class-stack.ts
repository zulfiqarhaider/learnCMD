import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import * as s3 from 'aws-cdk-lib/aws-s3'
import * as lambda from 'aws-cdk-lib/aws-lambda'
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class LearncdkClassStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const mybucket = new s3.Bucket(this, "muBucket", {

      bucketName: "workshop-cdk-typescript-zhaider"
    })

    const mylambda = new lambda.Function(this, "myLambdafunction", {

      code: lambda.Code.fromAsset('./test'),
      handler: "test.index",
      runtime: lambda.Runtime.PYTHON_3_8,
    }
    )
    mybucket.grantRead(mylambda)

    // example resource
    // const queue = new sqs.Queue(this, 'LearncdkClassQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
