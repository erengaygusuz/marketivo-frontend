import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../environments/environment';
import { from, lastValueFrom } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  const theEndpoint = environment.apiBaseUrl + '/orders';
  const securedEndpoints = [theEndpoint];

  if (securedEndpoints.some(url => req.urlWithParams.includes(url))) {
    return from(
      (async () => {
        // Get access token
        let token = '';
        await auth.getAccessTokenSilently().forEach((t) => (token = t));

        console.log('Access Token:', token);

        // Clone request with token
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Continue request
        return await lastValueFrom(next(authReq));
      })()
    );
  }

  // If not a secured endpoint, just forward request as-is
  return next(req);
};
