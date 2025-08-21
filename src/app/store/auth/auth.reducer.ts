import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(
    initialAuthState,

    on(AuthActions.initializeAuth, state => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    on(AuthActions.setLoading, (state, { isLoading }) => ({
        ...state,
        isLoading,
    })),

    on(AuthActions.setAuthenticationStatus, (state, { isAuthenticated }) => ({
        ...state,
        isAuthenticated,
        isLoading: false,
    })),

    on(AuthActions.setUser, (state, { user }) => ({
        ...state,
        user,
        isLoading: false,
        error: null,
    })),

    on(AuthActions.clearUser, state => ({
        ...state,
        user: null,
        isAuthenticated: false,
    })),

    on(AuthActions.setTokens, (state, { accessToken, idToken }) => ({
        ...state,
        accessToken,
        idToken: idToken || state.idToken,
        isTokenExpired: false,
        error: null,
    })),

    on(AuthActions.clearTokens, state => ({
        ...state,
        accessToken: null,
        idToken: null,
        isTokenExpired: false,
    })),

    on(AuthActions.setTokenExpired, (state, { isExpired }) => ({
        ...state,
        isTokenExpired: isExpired,
    })),

    on(AuthActions.login, state => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    on(AuthActions.loginSuccess, (state, { user, accessToken, idToken }) => ({
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user,
        accessToken,
        idToken: idToken || null,
        isTokenExpired: false,
        error: null,
    })),

    on(AuthActions.loginFailure, (state, { error }) => ({
        ...state,
        isAuthenticated: false,
        isLoading: false,
        user: null,
        accessToken: null,
        idToken: null,
        error,
    })),

    on(AuthActions.logout, state => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    on(AuthActions.logoutSuccess, () => ({
        ...initialAuthState,
        isLoading: false,
    })),

    on(AuthActions.logoutFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
    })),

    on(AuthActions.refreshToken, state => ({
        ...state,
        isLoading: true,
        error: null,
    })),

    on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({
        ...state,
        accessToken,
        isTokenExpired: false,
        isLoading: false,
        error: null,
    })),

    on(AuthActions.refreshTokenFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error,
        isTokenExpired: true,
    })),

    on(AuthActions.setError, (state, { error }) => ({
        ...state,
        error,
        isLoading: false,
    })),

    on(AuthActions.clearError, state => ({
        ...state,
        error: null,
    }))
);
