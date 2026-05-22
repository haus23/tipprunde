import { db } from "./db.server";

function getAuthCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...val] = part.trim().split("=");
    if (key === "__auth") return decodeURIComponent(val.join("="));
  }
  return null;
}

export async function getSessionUser(request: Request) {
  const sessionId = getAuthCookie(request);
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
