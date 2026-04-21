import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";

import { getSessionUser } from "#/app/(auth)/functions.server.ts";
import { getCookieSession } from "#/app/(auth)/session.server.ts";

export const managerMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getCookieSession();
  const user = await getSessionUser(session.data.sessionId);

  if (!user || (user.role !== "manager" && user.role !== "admin")) {
    throw redirect({ to: "/login" });
  }

  return next({ context: { user } });
});
