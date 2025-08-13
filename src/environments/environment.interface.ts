export interface Environment {
    production: boolean;
    apiBaseUrl: string;
    stripePublishableKey: string;
    auth: {
        domain: string;
        clientId: string;
        audience: string;
    };
    i18n: {
        defaultLanguage: string;
        supportedLanguages: string[];
    };
}
