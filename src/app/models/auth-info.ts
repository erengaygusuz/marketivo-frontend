import { User } from './user';

export interface AuthInfo {
    isAuthenticated: boolean;
    user: User | null;
    isLoading: boolean;
    error: string | null;
}
