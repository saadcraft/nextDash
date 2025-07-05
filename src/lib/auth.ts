// import apiRequest from "./request";
// import { getIronSession } from 'iron-session';
// import { SessionData } from "./sessionOptions";
// import { saveSession } from "./session";

import apiRequest from "./request";


type User = {
    username: string;
    password: string;
}

export default async function signIn({ username, password }: User) {
    try {
        const response = await fetch(`${process.env.SERVER_DOMAIN}/users/login`, {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        })
        const data = await response.json();
        if (response.status == 201) {
            return {
                code: response.status,
                data: data
            }

        } else {
            return {
                code: response.status,
                data: data.message
            }
        }
    } catch {
        return {
            code: 500,
            data: "Problem connection"
        }
    }
}

export async function Logout() {
    try {
        const response = await fetch(`${process.env.SERVER_DOMAIN}/users/logout`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        })
        const data = response.json();
        return data
    } catch {
        return null;
    }

}

export async function getUser(): Promise<UserAuth | null> {
    try {
        const response = await apiRequest(`/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        if (response.code == 200) {
            return response.data
        } else {
            return null
        }
    } catch {
        return null
    }
}
