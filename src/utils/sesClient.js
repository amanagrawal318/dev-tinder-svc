const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION || "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
