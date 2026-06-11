import { loginCodes, sessions } from "@tipprunde/db/schema";
import { eq } from "drizzle-orm";

import { db } from "./db.server.ts";

const APP_SECRET = process.env["APP_SECRET"]!;
const RESEND_API_KEY = process.env["RESEND_API_KEY"]!;
const FROM_EMAIL = process.env["FROM_EMAIL"]!;
const TOTP_EXPIRES_IN = Number(process.env["TOTP_EXPIRES_IN"]);
const TOTP_MAX_ATTEMPTS = Number(process.env["TOTP_MAX_ATTEMPTS"]);
const SESSION_DURATION_DEFAULT = Number(process.env["SESSION_DURATION_DEFAULT"]);
const SESSION_DURATION_REMEMBER = Number(process.env["SESSION_DURATION_REMEMBER"]);

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function findUserByEmail(email: string) {
  return db.query.users.findFirst({ where: { email } });
}

function generateCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  return String(new DataView(bytes.buffer).getUint32(0) % 1_000_000).padStart(6, "0");
}

async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(APP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(code));
  return toHex(sig);
}

export async function createLoginCode(userId: number): Promise<string> {
  const code = generateCode();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + TOTP_EXPIRES_IN * 1000).toISOString();

  // Replace any existing code for this user (userId is not unique).
  await db.delete(loginCodes).where(eq(loginCodes.userId, userId));
  await db.insert(loginCodes).values({
    id: crypto.randomUUID(),
    userId,
    codeHash,
    expiresAt,
    attempts: 0,
  });

  return code;
}

export type VerifyResult = "valid" | "invalid" | "expired" | "max_attempts" | "error";

export async function verifyLoginCode(userId: number, code: string): Promise<VerifyResult> {
  const record = await db.query.loginCodes.findFirst({ where: { userId } });

  // No pending code — someone bypassed the normal flow.
  if (!record) return "error";

  if (record.expiresAt < new Date().toISOString()) {
    await db.delete(loginCodes).where(eq(loginCodes.id, record.id));
    return "expired";
  }

  const hash = await hashCode(code);
  if (hash !== record.codeHash) {
    const attempts = record.attempts + 1;
    if (attempts >= TOTP_MAX_ATTEMPTS) {
      await db.delete(loginCodes).where(eq(loginCodes.id, record.id));
      return "max_attempts";
    }
    await db.update(loginCodes).set({ attempts }).where(eq(loginCodes.id, record.id));
    return "invalid";
  }

  await db.delete(loginCodes).where(eq(loginCodes.id, record.id));
  return "valid";
}

export async function sendLoginCodeEmail(to: string, code: string): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: "Dein Login-Code",
      html: `<p>Dein Code: <strong>${code}</strong></p><p>Er ist 10 Minuten gültig.</p>`,
    }),
  });

  if (!res.ok) throw new Error(`Resend error: ${res.status}`);
}

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes.buffer);
}

export async function createSession(userId: number, rememberMe: boolean): Promise<string> {
  const id = generateSessionId();
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await db.insert(sessions).values({ id, userId, rememberMe, expiresAt });
  return id;
}

export async function deleteSession(id: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, id));
}
