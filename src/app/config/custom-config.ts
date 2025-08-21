import { environment } from '../../environments/environment';

export default {
    auth: {
        domain: environment.auth.domain,
        clientId: environment.auth.clientId,
        authorizationParams: {
            redirect_uri: window.location.origin + '/login/callback',
            audience: environment.auth.audience,
        },
    },
    httpInterceptor: {
        allowedList: [`${environment.apiBaseUrl}/orders/**`, `${environment.apiBaseUrl}/checkout/purchase`],
    },
    i18n: {
        defaultLanguage: environment.i18n.defaultLanguage,
        supportedLanguages: environment.i18n.supportedLanguages,
    },
};
