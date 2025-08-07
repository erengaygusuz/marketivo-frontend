export default {
  auth: {
    domain: 'dev-p2akft8jby3faqa5.us.auth0.com',
    clientId: '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'https://marketivo.erengaygusuz.com.tr/api',
    },
  },
  httpInterceptor: {
    allowedList: [
      'https://marketivo.erengaygusuz.com.tr/api/orders/**',
      'https://marketivo.erengaygusuz.com.tr/api/checkout/purchase',
    ],
  },
};
