import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { getSessionUser } from "@/lib/auth/functions.server.ts";
import { useAppSession } from "@/lib/auth/session.ts";

export const managerMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await useAppSession();
  const user = await getSessionUser(session.data.sessionId);

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    throw redirect({ to: "/login" });
  }

  return next({ context: { user } });
});
