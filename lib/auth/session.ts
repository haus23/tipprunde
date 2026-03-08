import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { generateSessionId } from './cookie';
import { SESSION_DURATION_DEFAULT, SESSION_DURATION_REMEMBER } from './config';

export async function createSession(userId: string, rememberMe: boolean) {
  const id = generateSessionId();
  const now = new Date();
  const duration = rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(now.getTime() + duration * 1000);

  await db.insert(sessions).values({
    id,
    userId,
    rememberMe,
    expiresAt,
    createdAt: now,
  });

  return id;
}

export async function getSession(sessionId: string) {
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.id, sessionId),
    with: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
