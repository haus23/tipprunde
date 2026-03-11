import type { users } from "@/lib/db/schema.ts";
import { useSession } from "@tanstack/react-start/server";

type Role = (typeof users.$inferSelect)["role"];

type SessionData = {
  sessionId: string;
  role: Role;
};

export function useAppSession() {
  return useSession<SessionData>({
    name: "__session",
    password: process.env.SESSION_SECRET!, // At least 32 characters
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      httpOnly: true,
    },
  });
}
