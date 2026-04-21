import { updateSession, useSession } from "@tanstack/react-start/server";

import { env } from "#/utils/env.server.ts";
import type { UserRole } from "#db/dal/users.ts";

type SessionConfig = Parameters<typeof useSession>[0];

type Role = UserRole;

type SessionData = {
  sessionId: string;
  role: Role;
};

export const sessionConfig = {
  name: "__session",
  password: env.SESSION_SECRET,
  cookie: {
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    httpOnly: true,
  },
} satisfies SessionConfig;

export async function getCookieSession() {
  return useSession<SessionData>(sessionConfig);
}

export async function updateCookieSession(
  update: SessionData,
  cookieConfig?: Partial<SessionConfig["cookie"]>,
) {
  const config = {
    ...sessionConfig,
    cookie: {
      ...sessionConfig.cookie,
      ...cookieConfig,
    },
  };

  return updateSession(config, update);
}
