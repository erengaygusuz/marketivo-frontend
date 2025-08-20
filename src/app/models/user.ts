export interface User {
    sub?: string;
    name?: string;
    nickname?: string;
    email?: string;
    email_verified?: boolean;
    picture?: string;
    updated_at?: string;
    [key: string]: unknown;
}
