import { deleteSession, getSession } from "$lib/server/db/auth";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionId = event.cookies.get("__auth");

  if (sessionId) {
    const session = await getSession(sessionId);

    if (!session?.user || session.expiresAt < new Date().toISOString()) {
      event.cookies.delete("__auth", { path: "/" });
      await deleteSession(sessionId);
    } else {
      event.locals.user = {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
      };
    }
  }

  return await resolve(event);
};
