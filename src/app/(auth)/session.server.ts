import { createServerOnlyFn } from "@tanstack/react-start";
import { updateSession, useSession } from "@tanstack/react-start/server";

import { env } from "#/utils/env.server.ts";
import { createSession } from "#db/dal/sessions.ts";
import type { UserRole } from "#db/dal/users.ts";

type SessionConfig = Parameters<typeof useSession>[0];

type Role = UserRole;

type SessionData = {
  sessionId: string;
  role: Role;
};

const sessionConfig = {
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

function generateSessionId(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export const createDbSession = createServerOnlyFn(async (userId: number, rememberMe: boolean) => {
  const id = generateSessionId();
  const duration = rememberMe ? env.SESSION_DURATION_REMEMBER : env.SESSION_DURATION_DEFAULT;
  const expiresAt = new Date(Date.now() + duration * 1000).toISOString();
  await createSession({ id, userId, rememberMe, expiresAt });
  return id;
});
