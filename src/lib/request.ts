"use server"

import { redirect } from "next/navigation";
import refreshAccessToken from "./cookies";
import { clearSession, getSession, saveSession } from "./session";
import { SessionData } from "./sessionOptions";

export default async function apiRequest(url: string, options: { method?: string; headers?: HeadersInit; body?: BodyInit | null } = {}) {
    // console.log("apiRequest started for:", url);
    const session = await getSession();

    let refresh: boolean = false

    const headers = {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.user?.access_token}`, // Example: Add auth token
        ...options.headers,
    };

    // Start middleware: Log the request
    // console.log(`Request:`, { headers });

    try {
        // Make the fetch request
        let response = await fetch(process.env.SERVER_DOMAIN + url, { ...options, headers });


        if (response.status === 401) {
            console.log("Access token expired. Attempting to refresh...");
            if (!session?.user?.refresh_token) {
                // console.log("khra")
                return {
                    code: 401,
                    message: 'You lose your access'
                };
            }
            const newSession = await refreshAccessToken(session.user.refresh_token);
            if (newSession.code == 401) {
                console.log(newSession.message, " Logging out...");
                await clearSession(); // Replace '/login' with the desired redirect URL
                // redirect("/signin"); // ✅ Redirect if refresh fails
                return {
                    code: response.status,
                    message: 'You lose your access',
                };
            }

            const sessionData: SessionData = {
                user: {
                    ...session.user,
                    access_token: newSession.accessToken,
                    refresh_token: newSession.refreshToken,
                }
            }

            console.log(sessionData)

            refresh = true;
            // ✅ Update session properly using NextAuth’s callbacks

            await saveSession(sessionData);
            headers.Authorization = `Bearer ${newSession.accessToken}`;

            response = await fetch(process.env.SERVER_DOMAIN + url, {
                ...options,
                headers,
            });
        }
        if (!response.ok) {
            const dataError = await response.json();
            console.log(dataError)
            return {
                code: response.status,
                message: Array.isArray(dataError.message) ? dataError.message[0] : dataError.message
            }
        }

        // Parse the response
        const data = await response.json();

        return {
            code: response.status,
            data: data,
            refresh: refresh
        }
    } catch {
        // Handle network errors, JSON parsing errors, etc.
        // console.error('API request failed:', error);
        return {
            code: 500,
            message: 'An unknown error occurred',
            refresh: refresh
        };
    }
}