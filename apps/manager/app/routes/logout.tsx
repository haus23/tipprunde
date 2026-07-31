import { redirect } from "react-router";

import { deleteSession, destroySession, getSessionFromRequest } from "#/lib/session.server.ts";

import type { Route } from "./+types/logout";

export function loader() {
  throw redirect("/manager");
}

export async function action({ request }: Route.ActionArgs) {
  const session = await getSessionFromRequest(request);
  const sessionId = session.get("sessionId");
  if (sessionId) await deleteSession(sessionId);

  throw redirect("/", { headers: { "Set-Cookie": await destroySession(session) } });
}
