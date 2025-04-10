import apiRequest from "./request";
// import { getIronSession } from 'iron-session';
import { SessionData } from "./sessionOptions";
import { saveSession } from "./session";


type User = {
    username: string;
    password: string;
}

export default async function signIn({ username, password }: User) {
    try {
        const response = await apiRequest("/users/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.code == 201) {
            const sessionData: SessionData = {
                user: {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    role: response.data.role || 'USER', // Make sure to include role
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                }
            };
            await saveSession(sessionData);
            return {
                code: response.code,
                data: sessionData.user
            }

        } else {
            return {
                code: response.code,
                data: response.message === "You lose your access" ? "Your information is incorrect" : "wrong information"
            }
        }
    } catch {
        return {
            code: 500,
            data: "Problem connection"
        }
    }
}
