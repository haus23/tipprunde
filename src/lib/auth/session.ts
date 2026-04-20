import type { UserRole } from "#db/dal/users.ts";
import { updateSession, useSession } from "@tanstack/react-start/server";
import { SESSION_SECRET } from "@/lib/auth/config.ts";

// Extract the type from useSession's parameter
type SessionConfig = Parameters<typeof useSession>[0];

type Role = UserRole;

type SessionData = {
  sessionId: string;
  role: Role;
};

export const sessionConfig = {
  name: "__session",
  password: SESSION_SECRET, // At least 32 characters
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
  // Merge cookieConfig into original sessionConfig
  const newSessionConfig = {
    ...sessionConfig,
    cookie: {
      ...sessionConfig.cookie,
      ...cookieConfig,
    },
  };

  return updateSession(newSessionConfig, update);
}
