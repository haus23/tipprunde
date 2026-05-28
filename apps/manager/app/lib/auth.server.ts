import { sessions } from "@tipprunde/db/schema";
import { eq } from "drizzle-orm";

import { getCookie } from "./cookies.server";
import { db } from "./db.server";

export async function getSessionUser(request: Request) {
  const sessionId = getCookie(request, "__auth");
  if (!sessionId) return null;

  const session = await db.query.sessions.findFirst({
    where: { id: sessionId },
    with: { user: true },
  });

  if (!session || !session.user || session.expiresAt < new Date().toISOString()) return null;
  if (session.user.role !== "manager" && session.user.role !== "admin") return null;

  const { id, name, role } = session.user;
  return { id, name, role };
}

export async function deleteSession(sessionId: string) {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}
