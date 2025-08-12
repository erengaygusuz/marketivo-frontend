import { createAction, props } from '@ngrx/store';
import { User } from './auth.state';

// Initialize auth state from Auth0
export const initializeAuth = createAction('[Auth] Initialize Auth');

// Authentication status actions
export const setAuthenticationStatus = createAction(
    '[Auth] Set Authentication Status',
    props<{ isAuthenticated: boolean }>()
);

export const setLoading = createAction('[Auth] Set Loading', props<{ isLoading: boolean }>());

// User actions
export const setUser = createAction('[Auth] Set User', props<{ user: User | null }>());

export const clearUser = createAction('[Auth] Clear User');

// Token actions
export const setTokens = createAction(
    '[Auth] Set Tokens',
    props<{ accessToken: string | null; idToken?: string | null }>()
);

export const clearTokens = createAction('[Auth] Clear Tokens');

export const checkTokenExpiration = createAction('[Auth] Check Token Expiration');

export const setTokenExpired = createAction('[Auth] Set Token Expired', props<{ isExpired: boolean }>());

// Login/Logout actions
export const login = createAction('[Auth] Login');

export const loginSuccess = createAction(
    '[Auth] Login Success',
    props<{ user: User; accessToken: string; idToken?: string }>()
);

export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const logoutFailure = createAction('[Auth] Logout Failure', props<{ error: string }>());

// Error handling
export const setError = createAction('[Auth] Set Error', props<{ error: string | null }>());

export const clearError = createAction('[Auth] Clear Error');

// Silent token refresh
export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction('[Auth] Refresh Token Success', props<{ accessToken: string }>());

export const refreshTokenFailure = createAction('[Auth] Refresh Token Failure', props<{ error: string }>());
