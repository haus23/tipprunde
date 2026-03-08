import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { sessions } from '@/lib/db/schema';
import { generateSessionId } from './cookie';
import { SESSION_DURATION_DEFAULT, SESSION_DURATION_REMEMBER } from './config';

export async function createSession(userId: number, rememberMe: boolean) {
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
}

export async function getSession(sessionId: string) {
  const session = await db.query.sessions.findFirst({
    where: { id: sessionId },
    with: { user: true },
  });

  if (!session) return null;
  if (session.expiresAt < new Date().toISOString()) {
    await deleteSession(sessionId);
    return null;
  }

  return session;
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
