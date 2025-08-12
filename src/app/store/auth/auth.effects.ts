import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, switchMap, catchError, withLatestFrom, filter, take } from 'rxjs/operators';
import { of, from, EMPTY } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import * as AuthActions from './auth.actions';
import { selectIsAuthenticated, selectUser } from './auth.selectors';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private auth0Service = inject(AuthService);

  // Initialize auth state when app starts
  initializeAuth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.initializeAuth),
      switchMap(() =>
        this.auth0Service.isLoading$.pipe(
          filter(loading => !loading), // Wait for Auth0 to finish loading
          take(1),
          switchMap(() => 
            this.auth0Service.isAuthenticated$.pipe(
              take(1),
              switchMap(isAuthenticated => [
                AuthActions.setAuthenticationStatus({ isAuthenticated }),
                AuthActions.setLoading({ isLoading: false })
              ])
            )
          )
        )
      )
    )
  );

  // Listen to Auth0 authentication state changes
  listenToAuthState$ = createEffect(() =>
    this.auth0Service.isAuthenticated$.pipe(
      map(isAuthenticated => AuthActions.setAuthenticationStatus({ isAuthenticated }))
    )
  );

  // Listen to Auth0 loading state changes
  listenToLoadingState$ = createEffect(() =>
    this.auth0Service.isLoading$.pipe(
      map(isLoading => AuthActions.setLoading({ isLoading }))
    )
  );

  // Listen to Auth0 user changes and update store
  listenToUserChanges$ = createEffect(() =>
    this.auth0Service.user$.pipe(
      map(user => AuthActions.setUser({ user: user || null }))
    )
  );

  // Handle login
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      tap(() => {
        this.auth0Service.loginWithRedirect();
      })
    ),
    { dispatch: false }
  );

  // Handle logout
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        // Clear session storage
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userDisplayName');
        
        this.auth0Service.logout({
          logoutParams: {
            returnTo: window.location.origin
          }
        });
      }),
      map(() => AuthActions.logoutSuccess()),
      catchError(error => of(AuthActions.logoutFailure({ error: error.message })))
    )
  );

  // Get access token when authentication is successful
  getAccessToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setAuthenticationStatus),
      filter(({ isAuthenticated }) => isAuthenticated),
      switchMap(() =>
        this.auth0Service.getAccessTokenSilently().pipe(
          map(accessToken => AuthActions.setTokens({ accessToken })),
          catchError(error => of(AuthActions.setError({ error: error.message })))
        )
      )
    )
  );

  // Refresh token
  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.refreshToken),
      switchMap(() =>
        this.auth0Service.getAccessTokenSilently({ cacheMode: 'off' }).pipe(
          map(accessToken => AuthActions.refreshTokenSuccess({ accessToken })),
          catchError(error => of(AuthActions.refreshTokenFailure({ error: error.message })))
        )
      )
    )
  );

  // Store user data in session storage when user is set
  storeUserData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.setUser),
      withLatestFrom(this.store.select(selectIsAuthenticated)),
      filter(([action, isAuthenticated]) => isAuthenticated && !!action.user),
      tap(([action]) => {
        const user = action.user;
        if (user) {
          const displayName = user.name || user.nickname || user.email;
          if (displayName) {
            sessionStorage.setItem('userDisplayName', JSON.stringify(displayName));
          }
          if (user.email) {
            sessionStorage.setItem('userEmail', JSON.stringify(user.email));
          }
        }
      })
    ),
    { dispatch: false }
  );

  // Clear session storage on logout
  clearStorageOnLogout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logoutSuccess, AuthActions.clearUser),
      tap(() => {
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('userDisplayName');
      })
    ),
    { dispatch: false }
  );

  // Handle Auth0 errors
  handleAuth0Errors$ = createEffect(() =>
    this.auth0Service.error$.pipe(
      filter(error => !!error),
      map(error => AuthActions.setError({ error: error?.message || 'Authentication error' }))
    )
  );
}
