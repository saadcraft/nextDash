"user server"
import { NextRequest, NextResponse } from 'next/server'

// import { getToken } from 'next-auth/jwt';
// import { getIronSession } from 'iron-session';
// import { SessionData, sessionOptions } from './lib/sessionOptions';
// import refreshAccessToken from './lib/cookies';
// import { cookies } from 'next/headers';

// export { auth as middleware } from "@/auth"

const publicRoutes = ['/signin']

export async function middleware(req: NextRequest) {

    const response = NextResponse.next();

    const access = req.cookies.get("refresh_token")?.value;

    try {
        // Get the session using iron-session
        // const session = await getIronSession<SessionData>(
        //     req as unknown as Request,
        //     response as unknown as Response,
        //     sessionOptions
        // );



        // console.log("zaaabiiiiii", session.user)

        const path = req.nextUrl.pathname
        const isPublicRoute = publicRoutes.includes(path)
        const isProtectedRoute = !publicRoutes.includes(path);

        // if (session?.user && Date.now() > session.user.expires_at){
        //     try{
        //         const refresh = refreshAccessToken(session.user.refresh_token)

        //     }
        // }

        if (isProtectedRoute && !access) {
            return NextResponse.redirect(new URL("/signin", req.url)); // Redirect to login if not authenticated
        } else {
            if (isPublicRoute && access) {
                return NextResponse.redirect(new URL("/", req.url));
            }
        }

        return response;
    } catch (error) {
        console.error('Middleware error:', error);
        // Handle error gracefully - you might want to redirect or show an error page
        return response;
    }
}

export const config = {
    matcher: ['/((?!api|_next|fonts|icons|images|login|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.webp$|.*\\jpeg$|.*\\woff2$|.*\\.css$|.*\\.js$).*)', '/'],
};