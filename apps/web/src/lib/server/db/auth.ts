import { SESSION_DURATION_DEFAULT, SESSION_DURATION_REMEMBER } from "$env/static/private";
import { eq } from "drizzle-orm";

import { db, sessions, totpCodes } from ".";

export async function findUser(email: string) {
  return db.query.users.findFirst({ where: { email } });
}

export async function getTotpCode(userId: number) {
  return await db.query.totpCodes.findFirst({ where: { userId } });
}

export async function insertTotpCode(options: typeof totpCodes.$inferInsert) {
  // Remove old code (column userId is not unique)
  await db.delete(totpCodes).where(eq(totpCodes.userId, options.userId));

  await db.insert(totpCodes).values({
    ...options,
  });
}

export async function updateTotpCodeAttempts(id: string, attempts: number) {
  await db.update(totpCodes).set({ attempts }).where(eq(totpCodes.id, id));
}

export async function deleteTotpCode(id: string) {
  await db.delete(totpCodes).where(eq(totpCodes.id, id));
}

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export async function getSession(sessionId: string) {
  return db.query.sessions.findFirst({
    where: {
      id: sessionId,
    },
    with: {
      user: true,
    },
  });
}

export async function createSession(userId: number, rememberMe: boolean) {
  const id = generateSessionId();
  const duration = rememberMe
    ? Number(SESSION_DURATION_REMEMBER)
    : Number(SESSION_DURATION_DEFAULT);
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await db.insert(sessions).values({ id, userId, rememberMe, expiresAt });
  return id;
}

export async function deleteSession(id: string) {
  await db.delete(sessions).where(eq(sessions.id, id));
}
