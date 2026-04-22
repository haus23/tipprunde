import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { deleteSession, getSession } from "#db/dal/sessions.ts";
import { getCookieSession } from "#/app/(auth)/session.server.ts";

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

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getCookieSession();
  const { sessionId } = session.data;
  if (sessionId) await deleteSession(sessionId);
  await session.clear();
  throw redirect({ to: "/login" });
});
