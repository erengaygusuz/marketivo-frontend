// src/environments/environment.ts
import 'angular-server-side-configuration/process';
import { Environment } from './environment.interface';

const SUPPORTED = (process.env['SUPPORTED_LANGS'] || 'en-US,tr-TR')
    .split(',')
    .map((s: string) => s.trim())
    .filter(Boolean);

export const environment: Environment = {
    // default true; set PROD=false to disable in a container if you ever need
    production: process.env['PROD'] !== 'false',

    // fallback to your existing values for local/dev
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
