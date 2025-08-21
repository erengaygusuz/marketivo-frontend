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
                    const tokenFromStore = await authFacade.accessToken$.pipe(take(1)).toPromise();

                    let token = '';

                    if (tokenFromStore) {
                        const isExpired = await authFacade.isTokenExpired$.pipe(take(1)).toPromise();

                        if (!isExpired) {
                            token = tokenFromStore;
                        } else {
                            authFacade.refreshToken();
                            token = (await authFacade.accessToken$.pipe(take(1)).toPromise()) || '';
                        }
                    } else {
                        await auth.getAccessTokenSilently().forEach(t => {
                            token = t;
                            store.dispatch(AuthActions.setTokens({ accessToken: t }));
                        });
                    }

                    const authReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    return await lastValueFrom(next(authReq));
                } catch {
                    store.dispatch(AuthActions.setError({ error: 'Failed to get access token' }));

                    return await lastValueFrom(next(req));
                }
            })()
        );
    }

    return next(req);
};
