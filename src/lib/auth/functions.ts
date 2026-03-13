import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/auth/session.ts";
import { getDbSession } from "@/lib/auth/functions.server.ts";

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
  if (!session.data.sessionId) return null;

  const dbSession = await getDbSession(session.data.sessionId);
  if (!dbSession) {
    await session.clear();
    return null;
  }

  const { role } = session.data;
  if (role !== "manager" && role !== "admin") return null;

  return dbSession.user;
});
