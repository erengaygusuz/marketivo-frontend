import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Store } from '@ngrx/store';
import { from, lastValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthFacade } from '../facades/auth.facade';
import * as AuthActions from '../store/auth/auth.actions';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const authFacade = inject(AuthFacade);
    const store = inject(Store);

    const theEndpoint = environment.apiBaseUrl + '/orders';
    const securedEndpoints = [theEndpoint];

    if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
        return from(
            (async () => {
                try {
                    // Try to get access token from NgRx store first
                    const tokenFromStore = await authFacade.accessToken$.pipe(take(1)).toPromise();

                    let token = '';

                    if (tokenFromStore) {
                        // Check if token is expired
                        const isExpired = await authFacade.isTokenExpired$.pipe(take(1)).toPromise();

                        if (!isExpired) {
                            token = tokenFromStore;
                        } else {
                            // Token is expired, refresh it
                            authFacade.refreshToken();
                            token = (await authFacade.accessToken$.pipe(take(1)).toPromise()) || '';
                        }
                    } else {
                        // Get fresh token from Auth0 and update store
                        await auth.getAccessTokenSilently().forEach(t => {
                            token = t;
                            // Update the store with the new token
                            store.dispatch(AuthActions.setTokens({ accessToken: t }));
                        });
                    }

                    // Clone request with token
                    const authReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Continue request
                    return await lastValueFrom(next(authReq));
                } catch {
                    store.dispatch(AuthActions.setError({ error: 'Failed to get access token' }));

                    return await lastValueFrom(next(req));
                }
            })()
        );
    }

    // If not a secured endpoint, just forward request as-is
    return next(req);
};
