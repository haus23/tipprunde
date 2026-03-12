import { createServerOnlyFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { sessions, totpCodes } from "@/lib/db/schema.ts";
import { eq } from "drizzle-orm";
import {
  APP_SECRET,
  FROM_EMAIL,
  RESEND_API_KEY,
  SESSION_DURATION_DEFAULT,
  SESSION_DURATION_REMEMBER,
  TOTP_EXPIRES_IN,
  TOTP_MAX_ATTEMPTS,
} from "@/lib/auth/config.ts";
import { useAppSession } from "@/lib/auth/session.ts";

/*
 * Validate Email
 */
export const getUserByEmail = createServerOnlyFn(async (email: string) =>
  db.query.users.findFirst({
    where: { email },
  }),
);

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
  // Bestehenden Code löschen (nur ein aktiver Code pro User)
  await db.delete(totpCodes).where(eq(totpCodes.userId, userId));

  const code = generateCode();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + TOTP_EXPIRES_IN * 1000).toISOString();

  await db.insert(totpCodes).values({
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
    const record = await db.query.totpCodes.findFirst({
      where: { userId },
    });

    if (!record) return "invalid";

    if (record.expiresAt < new Date().toISOString()) {
      await db.delete(totpCodes).where(eq(totpCodes.id, record.id));
      return "expired";
    }

    const hash = await hashCode(code);

    if (hash !== record.codeHash) {
      const attempts = record.attempts + 1;
      if (attempts >= TOTP_MAX_ATTEMPTS) {
        await db.delete(totpCodes).where(eq(totpCodes.id, record.id));
        return "max_attempts";
      }
      await db.update(totpCodes).set({ attempts }).where(eq(totpCodes.id, record.id));
      return "invalid";
    }

    await db.delete(totpCodes).where(eq(totpCodes.id, record.id));
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

  await db.insert(sessions).values({
    id,
    userId,
    rememberMe,
    expiresAt,
  });

  return id;
});

export const getDbSession = createServerOnlyFn(async (sessionId: string) => {
  const session = await db.query.sessions.findFirst({
    where: { id: sessionId },
    with: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date().toISOString()) {
    const session = await useAppSession();
    await session.clear();
    return null;
  }

  return session;
});

export const deleteDbSessionById = createServerOnlyFn(async (sessionId: string) => {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
});
