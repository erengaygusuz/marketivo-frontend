# Authentication Management with NgRx

## Overview
The authentication system has been migrated from direct Auth0 service usage to NgRx for better state management, predictable data flow, and centralized authentication state handling.

## Architecture

### State Structure
```typescript
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  accessToken: string | null;
  idToken: string | null;
  isTokenExpired: boolean;
}
```

### Store Components

#### Actions (`auth.actions.ts`)
- `initializeAuth`: Initialize authentication state from Auth0
- `setAuthenticationStatus`: Update authentication status
- `setUser`: Set user information
- `setTokens`: Store access and ID tokens
- `login`: Trigger login flow
- `logout`: Trigger logout flow
- `refreshToken`: Refresh access token
- `setError`: Handle authentication errors

#### State (`auth.state.ts`)
- Defines the `AuthState` interface and `User` interface
- Contains initial state with default authentication values

#### Reducer (`auth.reducer.ts`)
- Handles state transitions based on dispatched actions
- Updates authentication status, user info, tokens, and loading states

#### Effects (`auth.effects.ts`)
- Handles side effects like Auth0 service integration
- Manages token refresh, session storage, and Auth0 state synchronization
- Listens to Auth0 observable changes and updates NgRx store accordingly

#### Selectors (`auth.selectors.ts`)
- `selectIsAuthenticated`: Gets authentication status
- `selectUser`: Gets user information
- `selectUserEmail`: Gets user email
- `selectUserName`: Gets user display name
- `selectAccessToken`: Gets access token
- `selectAuthError`: Gets authentication errors
- `selectUserProfile`: Gets combined user profile information

### Facade Service (`auth.facade.ts`)
Provides a clean API for components to interact with the auth store without directly importing store actions and selectors.

```typescript
// Subscribe to authentication status
this.authFacade.isAuthenticated$.subscribe(isAuth => {
  // Handle authentication state
});

// Login user
this.authFacade.login();

// Logout user
this.authFacade.logout();
```

## Usage

### In Components
```typescript
// Inject the facade service
constructor(private authFacade: AuthFacade) {}

// Subscribe to authentication status
this.authFacade.isAuthenticated$.subscribe(isAuthenticated => {
  // Handle authentication state change
});

// Subscribe to user information
this.authFacade.user$.subscribe(user => {
  // Handle user data
});

// Login
this.authFacade.login();

// Logout
this.authFacade.logout();
```

### Integration with Auth0
The NgRx auth store acts as a wrapper around Auth0, providing:
- Centralized state management
- Token caching and refresh handling
- Session storage synchronization
- Error handling
- Loading state management

## Migration Benefits
1. **Centralized State**: All authentication state is managed in one place
2. **Predictable Updates**: State changes follow Redux patterns
3. **Time Travel Debugging**: Redux DevTools support for auth state
4. **Side Effect Management**: Effects handle Auth0 integration and storage
5. **Type Safety**: Full TypeScript support with typed actions and state
6. **Token Management**: Automatic token refresh and caching
7. **Error Handling**: Centralized error state management

## Features
- **Auto-initialization**: Auth state is automatically initialized on app start
- **Token Refresh**: Automatic token refresh when expired
- **Session Storage**: User data persistence across browser sessions
- **Error Handling**: Comprehensive error state management
- **Loading States**: Track authentication operation progress

## Integration Points
- **Auth Interceptor**: Uses NgRx store for token management
- **Route Guards**: Can easily access authentication state
- **Components**: Clean facade API for all auth operations
- **Effects**: Handle all Auth0 service interactions

## Files Modified/Created
- `src/app/store/auth/` - Complete NgRx auth store
- `src/app/services/auth.facade.ts` - Facade service
- `src/app/components/login-status/login-status.component.ts` - Updated to use NgRx
- `src/app/components/profile-page/profile-page.component.ts` - Updated to use NgRx
- `src/app/interceptors/auth-interceptor.ts` - Updated to use NgRx store
- `src/app.config.ts` - Added AuthEffects
- `src/app/store/` - Updated root state and reducer
