import { Environment } from './environment.interface';

export const environment: Environment = {
    production: false,
    apiBaseUrl: 'https://localhost:5000/api',
    stripePublishableKey:
        'pk_test_51Nvx1SAkCHzlYhgHDLntydENy3WLqtcWq4Rb9LrQbASWWg5BbLdHxAYmRKbvMCzNZEtr7LbRenLgfY6OEcZr6DDS00QFfBKoAk',
    auth: {
        domain: 'dev-p2akft8jby3faqa5.us.auth0.com',
        clientId: '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
        audience: 'https://localhost:5000/api',
    },
    i18n: {
        defaultLanguage: 'en-US',
        supportedLanguages: ['en-US', 'tr-TR'],
    },
};
