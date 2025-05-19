import { eq } from 'drizzle-orm';

import app from '~/app';
import { sessions } from '~/database/schema';

export async function createSession(
  userId: number,
  expirationDate: Date,
  rememberMe: boolean,
) {
  const { db } = app;

  const [sessionData] = await db
    .insert(sessions)
    .values({
      userId: userId,
      expirationDate,
      expires: !rememberMe,
    })
    .returning();

  return sessionData;
}

export async function getSession(sessionId: string) {
  const { db } = app;
  return db.query.sessions.findFirst({
    where: (s, { eq }) => eq(s.id, sessionId),
  });
}

export async function updateSession(sessionId: string, expirationDate: Date) {
  const { db } = app;
  await db
    .update(sessions)
    .set({
      expirationDate,
      updatedAt: new Date(),
    })
    .where(eq(sessions.id, sessionId));
}

export async function deleteSession(sessionId: string) {
  const { db } = app;
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
