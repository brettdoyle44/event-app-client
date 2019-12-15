const dev = {
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'events-app-2-api-dev-imagesbucket-cc7eilaandog'
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://sl3ak5hntc.execute-api.us-east-2.amazonaws.com/dev'
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_oZoV6jOgy',
    APP_CLIENT_ID: '3pob1f4ab2s98pq6r0m4h0utc',
    IDENTITY_POOL_ID: 'us-east-2:fece94ee-e53a-4132-9fe7-141f302b256d'
  }
};

const prod = {
  s3: {
    REGION: 'us-east-2',
    BUCKET: 'events-app-2-api-prod-imagesbucket-15jgbaptiuihf'
  },
  apiGateway: {
    REGION: 'us-east-2',
    URL: 'https://cavxgyenag.execute-api.us-east-2.amazonaws.com/prod'
  },
  cognito: {
    REGION: 'us-east-2',
    USER_POOL_ID: 'us-east-2_5AcYrFQze',
    APP_CLIENT_ID: '74m5p4o6vp5mncru06edt5ae5h',
    IDENTITY_POOL_ID: 'us-east-2:ba76be5b-1db4-4239-96e4-9dc1841ca6f4'
  }
};

const config = process.env.REACT_APP_STAGE === 'prod' ? prod : dev;

export default {
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
