import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { totpCodes } from "@/lib/db/schema";
import { TOTP_EXPIRES_IN, TOTP_MAX_ATTEMPTS } from "./config";

type VerifyResult = "valid" | "invalid" | "expired" | "max_attempts";

function generateCode(): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const num = new DataView(bytes.buffer).getUint32(0);
  return String(num % 1_000_000).padStart(6, "0");
}

async function hashCode(code: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(process.env.APP_SECRET!),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(code));
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function createTotpCode(userId: number): Promise<string> {
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
}

export async function verifyTotpCode(userId: number, code: string): Promise<VerifyResult> {
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
}
