import { updateSession, useSession } from "@tanstack/react-start/server";

import type { UserRole } from "#db/dal/users.ts";
import { SESSION_SECRET } from "#/app/(auth)/config.ts";

type SessionConfig = Parameters<typeof useSession>[0];

type Role = UserRole;

type SessionData = {
  sessionId: string;
  role: Role;
};

export const sessionConfig = {
  name: "__session",
  password: SESSION_SECRET,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    httpOnly: true,
  },
} satisfies SessionConfig;

export async function useAppSession() {
  return useSession<SessionData>(sessionConfig);
}

export async function updateAppSession(
  update: SessionData,
  cookieConfig?: Partial<SessionConfig["cookie"]>,
) {
  const newSessionConfig = {
    ...sessionConfig,
    cookie: {
      ...sessionConfig.cookie,
      ...cookieConfig,
    },
  };

  return updateSession(newSessionConfig, update);
}
