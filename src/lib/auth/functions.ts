import { createServerFn } from "@tanstack/react-start";
import { useAppSession } from "@/lib/auth/session.ts";

export const fetchSession = createServerFn({ method: "GET" }).handler(async () => {
  const session = await useAppSession();
  if (!session.data.sessionId) return null;
  return {
    sessionId: session.data.sessionId,
    role: session.data.role,
  };
});
