// TODO: Cleanup

import { createServerOnlyFn } from "@tanstack/react-start";

import {
  APP_SECRET,
  FROM_EMAIL,
  RESEND_API_KEY,
  SESSION_DURATION_DEFAULT,
  SESSION_DURATION_REMEMBER,
  TOTP_EXPIRES_IN,
  TOTP_MAX_ATTEMPTS,
} from "#/app/(auth)/config.ts";
import { getCookieSession } from "#/app/(auth)/session.server.ts";
import { createSession, deleteSession, getSession } from "#db/dal/sessions.ts";
import {
  createTotpCode as dbCreateTotpCode,
  deleteTotpCode,
  deleteTotpCodes,
  getTotpCode,
  updateTotpCode,
} from "#db/dal/totps.ts";
import { getUserByEmail as dbGetUserByEmail } from "#db/dal/users.ts";

/*
 * Validate Email
 */
export const getUserByEmail = dbGetUserByEmail;

/*
 * TOTP Codes
 */
type VerifyResult = "valid" | "invalid" | "expired" | "max_attempts";

function generateCode() {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num = new DataView(bytes.buffer).getUint32(0);
  return String(num % 1_000_000).padStart(6, "0");
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
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(code));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createTotpCode = createServerOnlyFn(async (userId: number) => {
  await deleteTotpCodes(userId);

  const code = generateCode();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + TOTP_EXPIRES_IN * 1000).toISOString();

  await dbCreateTotpCode({
    id: crypto.randomUUID(),
    userId,
    codeHash,
    expiresAt,
    attempts: 0,
  });

  return code;
});

export const verifyTotpCode = createServerOnlyFn(
  async (userId: number, code: string): Promise<VerifyResult> => {
    const record = await getTotpCode(userId);

    if (!record) return "invalid";

    if (record.expiresAt < new Date().toISOString()) {
      await deleteTotpCode(record.id);
      return "expired";
    }

    const hash = await hashCode(code);

    if (hash !== record.codeHash) {
      const attempts = record.attempts + 1;
      if (attempts >= TOTP_MAX_ATTEMPTS) {
        await deleteTotpCode(record.id);
        return "max_attempts";
      }
      await updateTotpCode({ id: record.id, attempts });
      return "invalid";
    }

    await deleteTotpCode(record.id);
    return "valid";
  },
);

/*
 * Code Email
 */
export const sendTotpEmail = createServerOnlyFn(async (to: string, code: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to,
      subject: "Dein Login-Code",
      html: `<p>Dein Code lautet: <strong>${code}</strong></p><p>Er ist 10 Minuten gültig.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error: ${response.status}`);
  }
});

/*
 * DB Session
 */
function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createDbSession = createServerOnlyFn(async (userId: number, rememberMe: boolean) => {
  const id = generateSessionId();
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await createSession({ id, userId, rememberMe, expiresAt });
  return id;
});

export const getDbSession = createServerOnlyFn(async (sessionId: string) => {
  const session = await getSession(sessionId);
  if (!session) return null;
  if (session.expiresAt < new Date().toISOString()) {
    const appSession = await getCookieSession();
    await appSession.clear();
    return null;
  }
  return session;
});

export const deleteDbSessionById = createServerOnlyFn(async (sessionId: string) =>
  deleteSession(sessionId),
);
