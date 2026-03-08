import { cookies } from "next/headers";
import { SESSION_DURATION_REMEMBER } from './config';

export const SESSION_COOKIE = "__session";

export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function setSessionCookie(sessionId: string, rememberMe: boolean) {
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: SESSION_DURATION_REMEMBER } : {}),
  });
}

export async function getSessionId(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value;
}

export async function deleteSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
