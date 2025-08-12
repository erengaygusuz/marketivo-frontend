export interface User {
  sub?: string;
  name?: string;
  nickname?: string;
  email?: string;
  email_verified?: boolean;
  picture?: string;
  updated_at?: string;
  [key: string]: any;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  accessToken: string | null;
  idToken: string | null;
  isTokenExpired: boolean;
}

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null,
  accessToken: null,
  idToken: null,
  isTokenExpired: false
};
