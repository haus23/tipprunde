import type { users } from "@/lib/db/schema.ts";
import { useSession } from "@tanstack/react-start/server";
import { SESSION_SECRET } from "@/utils/auth/config.ts";

type Role = (typeof users.$inferSelect)["role"];

type SessionData = {
  sessionId: string;
  role: Role;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "__session",
    password: SESSION_SECRET, // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
