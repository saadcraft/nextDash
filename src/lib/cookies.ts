

export default async function refreshAccessToken(refresh: string) {
    // const { update } = useSession()
    // console.log(refresh)
    // const router = useRouter()
    try {
        // console.log(refresh)

        const refreshed = await fetch(`${process.env.SERVER_DOMAIN}/users/refresh`, {
            method: "POST",
            body: JSON.stringify({ refresh_token: refresh }),
            headers: { "Content-Type": "application/json" },
        });

        if (!refreshed.ok) {
            console.error("Refresh endpoint error status:", refreshed.status);
            return {
                code: refreshed.status,
                message: "Refresh failed",
            };
        }

        const res = await refreshed.json()

        // console.log(res)

        // const ref = {
        //     accessToken: res.access_token,
        //     refreshToken: res.refresh_token || refresh.refreshToken,
        // };

        // console.log(ref)
        return {
            accessToken: res.access_token,
            refreshToken: res.refresh_token || refresh,
        };

    } catch {
        console.log("Error refreshing token: Problem with fetch refresh");
        return {
            code: 401,
            message: "fail to refresh",
        };
    }
}