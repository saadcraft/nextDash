// lib/sessionOptions.ts
import { SessionOptions } from "iron-session";

export interface SessionData {
    user?: {
        id: string;
        username: string;
        email: string;
        role: string;
        access_token: string;
        refresh_token: string;
    };
}

export const sessionOptions: SessionOptions = {
    cookieName: "auth-session",
    password: process.env.AUTH_SECRET || "Zpp2321FEGREZGdzda7XkHUo7BNGPhOTc33dDAFZfadfzaVjm47jpUH270bgzs=",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        httpOnly: true, // Prevent client-side access
        sameSite: "strict",
        path: "/",
        maxAge: 24 * 60 * 60, // 1 day
    },
};