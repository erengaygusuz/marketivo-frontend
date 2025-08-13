import { Environment } from './environment.interface';

export const environment: Environment = {
    production: true,
    apiBaseUrl: '/api',
    stripePublishableKey:
        'pk_test_51Nvx1SAkCHzlYhgHDLntydENy3WLqtcWq4Rb9LrQbASWWg5BbLdHxAYmRKbvMCzNZEtr7LbRenLgfY6OEcZr6DDS00QFfBKoAk',
    auth: {
        domain: 'auth.marketivo.erengaygusuz.com.tr',
        clientId: '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
        audience: 'https://marketivo.erengaygusuz.com.tr/api',
    },
    i18n: {
        defaultLanguage: 'en-US',
        supportedLanguages: ['en-US', 'tr-TR'],
    },
};
