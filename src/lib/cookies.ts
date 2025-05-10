"use client"
// import { useRouter } from "next/navigation";
import { Logout } from "./auth";
import { useRouter } from "next/navigation";

export default async function refreshAccessToken() {
    // const { update } = useSession()

    try {

        const refreshed = await fetch(`${process.env.SERVER_DOMAIN}/users/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
        });

        console.log("here")

        if (!refreshed.ok) {

            console.log("Refresh endpoint error status:", refreshed.status);
            await Logout()

            // router.replace("/signin")
            return {
                code: refreshed.status,
                message: "Refresh failed",
            };
        }

        const res = await refreshed.json()

        // console.log(ref)
        return {
            accessToken: res.access_token,
            refreshToken: res.refresh_token,
        };

    } catch {
        console.log("Error refreshing token: Problem with fetch refresh");
        return null
    }
}