"use server"
// lib/session.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "./sessionOptions";

export async function getSession() {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
    return session;
}

export async function saveSession(sessionData: SessionData) {
    const session = await getSession();
    Object.assign(session, sessionData);
    await session.save();
}

export async function clearSession() {
    const session = await getSession();
    session.destroy();
    return true
}