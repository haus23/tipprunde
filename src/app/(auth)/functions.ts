import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getSessionUser } from "#/app/(auth)/functions.server.ts";
import { getCookieSession } from "#/app/(auth)/session.server.ts";

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCookieSession();
  if (!session.data.sessionId) return null;
  return {
    sessionId: session.data.sessionId,
    role: session.data.role,
  };
});

export const requireManager = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCookieSession();
  const user = await getSessionUser(session.data.sessionId);

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    await session.clear();
    throw redirect({ to: "/login" });
  }

  return user;
});
