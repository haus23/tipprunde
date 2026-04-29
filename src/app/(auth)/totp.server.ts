import { createServerOnlyFn } from "@tanstack/react-start";

import { env } from "#/utils/env.server.ts";
import {
  createTotpCode,
  deleteTotpCode,
  deleteTotpCodes,
  getTotpCode,
  updateTotpCode,
} from "#db/dal/totps.ts";
import { getUserByEmail } from "#db/dal/users.ts";

export const getUserByEmailFn = getUserByEmail;

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
    encoder.encode(env.APP_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(code));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createTotpCodeFn = createServerOnlyFn(async (userId: number) => {
  await deleteTotpCodes(userId);

  const code = generateCode();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + env.TOTP_EXPIRES_IN * 1000).toISOString();

  await createTotpCode({
    id: crypto.randomUUID(),
    userId,
    codeHash,
    expiresAt,
    attempts: 0,
  });

  return code;
});

export const verifyTotpCodeFn = createServerOnlyFn(
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
      if (attempts >= env.TOTP_MAX_ATTEMPTS) {
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

export const sendTotpEmailFn = createServerOnlyFn(async (to: string, code: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL,
      to,
      subject: "Dein Login-Code",
      html: `<p>Dein Code lautet: <strong>${code}</strong></p><p>Er ist 10 Minuten gültig.</p>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend error: ${response.status}`);
  }
});
