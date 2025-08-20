import { User } from './user';

export interface UserProfile {
    user: User | null;
    isAuthenticated: boolean;
    displayName: string | null;
    email: string | null;
    picture: string | null;
    isEmailVerified: boolean;
}
