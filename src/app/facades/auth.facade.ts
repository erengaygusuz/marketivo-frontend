import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthInfo } from '../models/auth-info';
import { User } from '../models/user';
import { UserProfile } from '../models/user-profile';
import { AppState } from '../store/app.state';
import * as AuthActions from '../store/auth/auth.actions';
import * as AuthSelectors from '../store/auth/auth.selectors';

@Injectable({
    providedIn: 'root',
})
export class AuthFacade {
    constructor(private store: Store<AppState>) {}

    get isAuthenticated$(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectIsAuthenticated);
    }

    get isLoading$(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectIsLoading);
    }

    get user$(): Observable<User | null> {
        return this.store.select(AuthSelectors.selectUser);
    }

    get userProfile$(): Observable<UserProfile> {
        return this.store.select(AuthSelectors.selectUserProfile);
    }

    get userEmail$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectUserEmail);
    }

    get userName$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectUserName);
    }

    get userPicture$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectUserPicture);
    }

    get accessToken$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectAccessToken);
    }

    get idToken$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectIdToken);
    }

    get error$(): Observable<string | null> {
        return this.store.select(AuthSelectors.selectAuthError);
    }

    get authInfo$(): Observable<AuthInfo> {
        return this.store.select(AuthSelectors.selectAuthInfo);
    }

    get hasValidToken$(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectHasValidToken);
    }

    get isTokenExpired$(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectIsTokenExpired);
    }

    get isEmailVerified$(): Observable<boolean> {
        return this.store.select(AuthSelectors.selectIsEmailVerified);
    }

    // Actions
    initializeAuth(): void {
        this.store.dispatch(AuthActions.initializeAuth());
    }

    login(): void {
        this.store.dispatch(AuthActions.login());
    }

    logout(): void {
        this.store.dispatch(AuthActions.logout());
    }

    refreshToken(): void {
        this.store.dispatch(AuthActions.refreshToken());
    }

    clearError(): void {
        this.store.dispatch(AuthActions.clearError());
    }

    setUser(user: User | null): void {
        this.store.dispatch(AuthActions.setUser({ user }));
    }

    setTokens(accessToken: string | null, idToken?: string | null): void {
        this.store.dispatch(AuthActions.setTokens({ accessToken, idToken }));
    }

    checkTokenExpiration(): void {
        this.store.dispatch(AuthActions.checkTokenExpiration());
    }

    getCurrentUser(): Observable<User | null> {
        return this.user$;
    }

    getAuthenticationStatus(): Observable<boolean> {
        return this.isAuthenticated$;
    }

    getUserDisplayName(): Observable<string | null> {
        return this.userName$;
    }

    getUserEmail(): Observable<string | null> {
        return this.userEmail$;
    }

    getAccessToken(): Observable<string | null> {
        return this.accessToken$;
    }
}
