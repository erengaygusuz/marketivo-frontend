import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../models/user';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Authentication status selectors
export const selectIsAuthenticated = createSelector(selectAuthState, (state: AuthState) => state.isAuthenticated);

export const selectIsLoading = createSelector(selectAuthState, (state: AuthState) => state.isLoading);

export const selectAuthError = createSelector(selectAuthState, (state: AuthState) => state.error);

// User selectors
export const selectUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectUserEmail = createSelector(selectUser, (user: User | null) => user?.email || null);

export const selectUserName = createSelector(
    selectUser,
    (user: User | null) => user?.name || user?.nickname || user?.email || null
);

export const selectUserPicture = createSelector(selectUser, (user: User | null) => user?.picture || null);

export const selectIsEmailVerified = createSelector(selectUser, (user: User | null) => user?.email_verified || false);

// Token selectors
export const selectAccessToken = createSelector(selectAuthState, (state: AuthState) => state.accessToken);

export const selectIdToken = createSelector(selectAuthState, (state: AuthState) => state.idToken);

export const selectIsTokenExpired = createSelector(selectAuthState, (state: AuthState) => state.isTokenExpired);

export const selectHasValidToken = createSelector(
    selectAccessToken,
    selectIsTokenExpired,
    (accessToken, isExpired) => !!accessToken && !isExpired
);

// Combined selectors
export const selectAuthInfo = createSelector(
    selectIsAuthenticated,
    selectUser,
    selectIsLoading,
    selectAuthError,
    (isAuthenticated, user, isLoading, error) => ({
        isAuthenticated,
        user,
        isLoading,
        error,
    })
);

export const selectUserProfile = createSelector(selectUser, selectIsAuthenticated, (user, isAuthenticated) => ({
    user,
    isAuthenticated,
    displayName: user?.name || user?.nickname || user?.email || null,
    email: user?.email || null,
    picture: user?.picture || null,
    isEmailVerified: user?.email_verified || false,
}));
