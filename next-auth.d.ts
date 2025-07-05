import "next-auth";

declare module "next-auth" {
    interface User {
        id?: string;
        username?: string;
        email?: string;
        accessToken?: string;
        refreshToken?: string;
        expires_at?: number;
    }

    interface Session {
        accessToken?: string;
        refreshToken?: string;
        error?: string;
        user: {
            id?: string;
            username?: string;
            email?: string;
        };
    }
}