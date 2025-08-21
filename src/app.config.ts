import customConfig from '@/config/custom-config';
import { AuthInterceptor } from '@/interceptors/auth-interceptor';
import { LanguageInterceptor } from '@/interceptors/language-interceptor';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { provideAuth0 } from '@auth0/auth0-angular';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule, TranslationObject } from '@ngx-translate/core';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { Observable } from 'rxjs';
import { appRoutes } from './app.routes';
import { AuthEffects } from './app/store/auth/auth.effects';
import { CartEffects } from './app/store/cart/cart.effects';
import { CheckoutEffects } from './app/store/checkout/checkout.effects';
import { LanguageEffects } from './app/store/language/language.effects';
import { OrderHistoryEffects } from './app/store/order-history/order-history.effects';
import { ProductEffects } from './app/store/product/product.effects';
import { rootReducer } from './app/store/root.reducer';

export class CustomTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient) {}

    getTranslation(lang: string): Observable<TranslationObject> {
        return this.http.get<TranslationObject>(`/i18n/${lang}.json`);
    }
}

export function HttpLoaderFactory(http: HttpClient) {
    return new CustomTranslateLoader(http);
}

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
            withEnabledBlockingInitialNavigation()
        ),
        provideHttpClient(withFetch(), withInterceptors([LanguageInterceptor, AuthInterceptor])),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        provideAuth0({
            ...customConfig.auth,
            httpInterceptor: {
                ...customConfig.httpInterceptor,
            },
        }),
        MessageService,
        provideStore(rootReducer),
        provideEffects([
            CartEffects,
            LanguageEffects,
            AuthEffects,
            ProductEffects,
            OrderHistoryEffects,
            CheckoutEffects,
        ]),
        provideStoreDevtools({
            maxAge: 25,
            logOnly: !isDevMode(),
            autoPause: true,
            trace: false,
            traceLimit: 75,
        }),
        importProvidersFrom(
            TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
                defaultLanguage: customConfig.i18n.defaultLanguage,
            })
        ),
    ],
};
