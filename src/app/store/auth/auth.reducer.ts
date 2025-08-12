import { createReducer, on } from '@ngrx/store';
import { AuthState, initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';

export const authReducer = createReducer(
  initialAuthState,
  
  // Initialize auth
  on(AuthActions.initializeAuth, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  // Loading state
  on(AuthActions.setLoading, (state, { isLoading }) => ({
    ...state,
    isLoading
  })),
  
  // Authentication status
  on(AuthActions.setAuthenticationStatus, (state, { isAuthenticated }) => ({
    ...state,
    isAuthenticated,
    isLoading: false
  })),
  
  // User management
  on(AuthActions.setUser, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.clearUser, (state) => ({
    ...state,
    user: null,
    isAuthenticated: false
  })),
  
  // Token management
  on(AuthActions.setTokens, (state, { accessToken, idToken }) => ({
    ...state,
    accessToken,
    idToken: idToken || state.idToken,
    isTokenExpired: false,
    error: null
  })),
  
  on(AuthActions.clearTokens, (state) => ({
    ...state,
    accessToken: null,
    idToken: null,
    isTokenExpired: false
  })),
  
  on(AuthActions.setTokenExpired, (state, { isExpired }) => ({
    ...state,
    isTokenExpired: isExpired
  })),
  
  // Login flow
  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.loginSuccess, (state, { user, accessToken, idToken }) => ({
    ...state,
    isAuthenticated: true,
    isLoading: false,
    user,
    accessToken,
    idToken: idToken || null,
    isTokenExpired: false,
    error: null
  })),
  
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    accessToken: null,
    idToken: null,
    error
  })),
  
  // Logout flow
  on(AuthActions.logout, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.logoutSuccess, (state) => ({
    ...initialAuthState,
    isLoading: false
  })),
  
  on(AuthActions.logoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  
  // Token refresh
  on(AuthActions.refreshToken, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),
  
  on(AuthActions.refreshTokenSuccess, (state, { accessToken }) => ({
    ...state,
    accessToken,
    isTokenExpired: false,
    isLoading: false,
    error: null
  })),
  
  on(AuthActions.refreshTokenFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
    isTokenExpired: true
  })),
  
  // Error handling
  on(AuthActions.setError, (state, { error }) => ({
    ...state,
    error,
    isLoading: false
  })),
  
  on(AuthActions.clearError, (state) => ({
    ...state,
    error: null
  }))
);
