import { createServerFn } from "@tanstack/react-start";

import { getCookieSession } from "#/app/(auth)/session.server.ts";
import { deleteSession, getSession } from "#db/dal/sessions.ts";

export const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
  const cookieSession = await getCookieSession();
  const { sessionId, role } = cookieSession.data;
  if (!sessionId) return null;

  const session = await getSession(sessionId);
  if (!session) return null;

  if (session.expiresAt < new Date().toISOString() || session.user?.role !== role) {
    await Promise.all([deleteSession(sessionId), cookieSession.clear()]);
    return null;
  }

  return session.user;
});
