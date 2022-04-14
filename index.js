
const AWS = require('aws-sdk');

const region= 'us-east-1'

console.log('In Lambda function');

exports.handler= function handler(event,context,callback){
  
    console.log('Message from SNS....');

    var msg = event.Records[0].Sns.Message;

    var token = event.Records[0].Sns.Subject

    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10', region: "us-east-1"});

    AWS.config.update({
        secretaccesskey : process.env.AWS_SECRET_ACCESS_KEY,
        accesskey :process.env.AWS_ACCESS_KEY_ID,
        region : "us-east-1"
    })

    //to check if the username exists in the username dynamo DB. If it does not exist, send the email

    var tokenparams ={
            Key: {
                'Username': {S: msg}
            },
            TableName: 'myDynamoUsernameTable',
            ProjectionExpression : 'Username'
    };

    console.log("checking from username dynamo DB",tokenparams);

    var usernameExists = await dynamodb.getItem(tokenparams).promise();

     // check if the user exists from the dynamo DB
    if(usernameExists.Item==undefined||usernameExists.Item==""){

            console.log("User doesn't exist, sending email");

            //declaring the email parameters    

            var emailParams ={

             Destination:{
                 ToAddresses:[
                     msg
                 ]},
                 Message:{
                     Body: {
                         Html: {
                            Charset: "UTF-8",
                            Data: "Verifying user link. Find the token as follows.."+token
                         }
                     },
                     Subject: {
                        Charset: "UTF-8",
                        Data: 'Link to verify email address'
                     }
                 },
                 Source: "csye6225neha@prod.nehabattula.me"
            };

           //sending email 

            var sendingEmail = new AWS.SES({ apiVersion: '2010-12-01', region: "us-east-1" });
            await sendingEmail.sendEmail(emailParams).promise();
        
           //Adding to UsernameDynamoDB

            var paramsDB = {
                Item: {
                'Username': {S: msg}
                },
                TableName: 'myDynamoUsernameTable'

            }

            await dynamodb.putItem(paramsDB).promise();

    } //if username doesn't exist

}