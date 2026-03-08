import { cookies } from "next/headers";
import type { users } from "@/lib/db/schema";
import { SESSION_DURATION_REMEMBER } from "./config";

export const SESSION_COOKIE = "__session";

type Role = (typeof users.$inferSelect)["role"];

export function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hmac(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.APP_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

function buildCookieValue(sessionId: string, role: Role, signature: string) {
  return `${sessionId}.${role}.${signature}`;
}

export async function parseSessionCookie(
  value: string,
): Promise<{ sessionId: string; role: Role } | null> {
  const parts = value.split(".");
  if (parts.length !== 3) return null;

  const [sessionId, role, signature] = parts;
  const expected = await hmac(`${sessionId}.${role}`);
  if (expected !== signature) return null;

  return { sessionId, role: role as Role };
}

export async function setSessionCookie(sessionId: string, role: Role, rememberMe: boolean) {
  const signature = await hmac(`${sessionId}.${role}`);
  const value = buildCookieValue(sessionId, role, signature);

  const store = await cookies();
  store.set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(rememberMe ? { maxAge: SESSION_DURATION_REMEMBER } : {}),
  });
}

export async function deleteSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
