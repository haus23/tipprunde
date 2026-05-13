import { APP_SECRET, TOTP_EXPIRES_IN, TOTP_MAX_ATTEMPTS } from "$env/static/private";

import { deleteTotpCode, getTotpCode, insertTotpCode, updateTotpCodeAttempts } from "./db/auth";

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
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createTotpCode(userId: number): Promise<string> {
  const code = generateCode();
  const codeHash = await hashCode(code);
  const expiresAt = new Date(Date.now() + Number(TOTP_EXPIRES_IN) * 1000).toISOString();

  await insertTotpCode({
    id: crypto.randomUUID(),
    userId,
    codeHash,
    expiresAt,
    attempts: 0,
  });

  return code;
}

export type VerifyResult = "error" | "valid" | "invalid" | "expired" | "max_attempts";

export async function verifyTotpCode(userId: number, code: string): Promise<VerifyResult> {
  const record = await getTotpCode(userId);

  // Should not happen (someone tricked our auth system)
  if (!record) return "error";

  if (record.expiresAt < new Date().toISOString()) {
    await deleteTotpCode(record.id);
    return "expired";
  }

  const hash = await hashCode(code);

  if (hash !== record.codeHash) {
    const attempts = record.attempts + 1;
    if (attempts >= Number(TOTP_MAX_ATTEMPTS)) {
      await deleteTotpCode(record.id);
      return "max_attempts";
    }
    await updateTotpCodeAttempts(record.id, attempts);
    return "invalid";
  }

  await deleteTotpCode(record.id);
  return "valid";
}
