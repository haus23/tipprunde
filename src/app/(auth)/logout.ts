import { createServerFn } from "@tanstack/react-start";
import { redirect } from "@tanstack/react-router";

import { getCookieSession } from "#/app/(auth)/session.server.ts";
import { deleteSession } from "#db/dal/sessions.ts";

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const session = await getCookieSession();
  const { sessionId } = session.data;

  if (sessionId) {
    await deleteSession(sessionId);
  }

  await session.clear();
  throw redirect({ to: "/" });
});
