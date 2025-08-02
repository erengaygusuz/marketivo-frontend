export default {
  auth: {
    domain: 'dev-p2akft8jby3faqa5.us.auth0.com',
    clientId: '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
    authorizationParams: {
      redirect_uri: 'https://marketivo.erengaygusuz.com.tr/login/callback',
      audience: 'https://api-marketivo.erengaygusuz.com.tr',
    },
  },
  httpInterceptor: {
    allowedList: [
      'https://api-marketivo.erengaygusuz.com.tr/api/orders/**',
      'https://api-marketivo.erengaygusuz.com.tr/api/checkout/purchase',
    ],
  },
};
