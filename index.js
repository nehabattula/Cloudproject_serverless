// import AWS from 'aws-sdk';

// var emailFromLambda = new AWS.SES({re});

console.log('In Lambda function');
export function handler(event,context,callback){
  console.log('Message from SNS....');
  var message = event.Records[0].Sns.Message;
  callback(null,"Success");
}

//zip the File
//upload to s3
//code deploy to aws 