export default {
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'event-image-upload'
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://4rz2r2wb34.execute-api.us-east-2.amazonaws.com/prod/'
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_8DvTAP1gC',
    APP_CLIENT_ID: '7gideb5d3m4o06o093r0de32en',
    IDENTITY_POOL_ID: 'us-east-2:0e61a895-eb2a-492c-ba7d-cf3b295f4054'
  }
};
