import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { getSessionUser } from "@/lib/auth/functions.server.ts";
import { useAppSession } from "@/lib/auth/session.ts";

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  if (!session.data.sessionId) return null;
  return {
    sessionId: session.data.sessionId,
    role: session.data.role,
  };
});

export const requireManager = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  const user = await getSessionUser(session.data.sessionId);

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    await session.clear();
    throw redirect({ to: "/login" });
  }

  return user;
});
