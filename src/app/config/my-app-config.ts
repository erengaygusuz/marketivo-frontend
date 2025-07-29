export default {
  auth: {
    domain: 'dev-p2akft8jby3faqa5.us.auth0.com',
    clientId: '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
    authorizationParams: {
      redirect_uri: 'https://localhost:4200/login/callback',
      audience: 'http://localhost:8080',
    },
  },
  httpInterceptor: {
    allowedList: [
      'http://localhost:8080/api/orders/**',
      'http://localhost:8080/api/checkout/purchase',
    ],
  },
};
