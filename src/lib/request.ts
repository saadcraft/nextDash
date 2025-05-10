// "use server"

// import { cookies } from "next/headers";
import refreshAccessToken from "./cookies";

// import { redirect } from "next/navigation";
// import refreshAccessToken from "./cookies";
// import { clearSession, getSession, saveSession } from "./session";
// import { SessionData } from "./sessionOptions";

export default async function apiRequest(url: string, options: { method?: string; headers?: HeadersInit; body?: BodyInit | null } = {}) {
    // console.log("apiRequest started for:", url);
    // const session = await getSession();

    // const cookies = document.cookie;
    // const accessToken = cookies
    //     .split('; ')
    //     .find((row) => row.startsWith('access_token='))
    //     ?.split('=')[1];


    const headers = {
        // 'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`, // Example: Add auth token
        ...options.headers,
    };

    // Start middleware: Log the request
    // console.log(`Request:`, { headers });

    try {
        // Make the fetch request
        let response = await fetch(process.env.SERVER_DOMAIN + url, { ...options, headers, credentials: "include" });


        if (response.status === 401) {
            console.log("Access token expired. Attempting to refresh...");
            // if (!session?.user?.refresh_token) {
            //     // console.log("khra")
            //     return {
            //         code: 401,
            //         message: 'You lose your access'
            //     };
            // }
            const newSession = await refreshAccessToken();

            if (!newSession) {

            }

            console.log("aa", newSession)

            response = await fetch(process.env.SERVER_DOMAIN + url, {
                ...options,
                headers,
                credentials: "include"
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
            // refresh: refresh
        }
    } catch {
        // Handle network errors, JSON parsing errors, etc.
        // console.error('API request failed:', error);
        return {
            code: 500,
            message: 'An unknown error occurred',
            // refresh: refresh
        };
    }
}