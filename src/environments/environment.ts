import 'angular-server-side-configuration/process';
import { Environment } from './environment.interface';

const SUPPORTED = (process.env['SUPPORTED_LANGS'] || 'en-US,tr-TR')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

export const environment: Environment = {
    production: process.env['PROD'] !== 'false',

    apiBaseUrl: process.env['API_ADDRESS'] || '/api',
    stripePublishableKey:
        process.env['STRIPE_PK'] ||
        'pk_test_51Nvx1SAkCHzlYhgHDLntydENy3WLqtcWq4Rb9LrQbASWWg5BbLdHxAYmRKbvMCzNZEtr7LbRenLgfY6OEcZr6DDS00QFfBKoAk',

    auth: {
        domain: process.env['AUTH_DOMAIN'] || 'auth.marketivo.erengaygusuz.com.tr',
        clientId: process.env['AUTH_CLIENT_ID'] || '4Bt3FnArUUElthacdpLdxSszDTczN1VI',
        audience: process.env['AUTH_AUDIENCE'] || 'https://marketivo.erengaygusuz.com.tr/api',
    },

    i18n: {
        defaultLanguage: process.env['DEFAULT_LANG'] || 'en-US',
        supportedLanguages: SUPPORTED,
    },
};
