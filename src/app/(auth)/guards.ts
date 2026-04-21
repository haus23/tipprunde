import { redirect } from "@tanstack/react-router";
import { createMiddleware, createServerFn } from "@tanstack/react-start";

import { getCookieSession } from "#/app/(auth)/session.server.ts";

function isManager(role: string | undefined) {
  return role === "manager" || role === "admin";
}

export const requireManager = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getCookieSession();

  if (!isManager(session.data.role)) {
    throw redirect({ to: "/login" });
  }
});

export const managerMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getCookieSession();

  if (!isManager(session.data.role)) {
    throw redirect({ to: "/login" });
  }

  return next();
});
