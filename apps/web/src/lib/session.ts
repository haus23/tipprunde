import { createServerFn } from "@tanstack/react-start";
import { getCookie } from "@tanstack/react-start/server";

import { db } from "./db.ts";

export type ColorScheme = "light" | "dark" | "system";

export type SessionUser = {
  id: number;
  name: string;
  slug: string;
  role: "user" | "manager" | "admin";
};

export const getSessionData = createServerFn().handler(async () => {
  const raw = getCookie("__color-scheme");
  const colorScheme: ColorScheme = raw === "light" || raw === "dark" ? raw : "system";

  const sessionId = getCookie("__auth");
  let user: SessionUser | null = null;

  if (sessionId) {
    const session = await db.query.sessions.findFirst({
      where: { id: sessionId },
      with: {
        user: { columns: { id: true, name: true, slug: true, role: true } },
      },
    });

    if (session && new Date(session.expiresAt) > new Date() && session.user) {
      user = session.user as SessionUser;
    }
  }

  return { colorScheme, user };
});
