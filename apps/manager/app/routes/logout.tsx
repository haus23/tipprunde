import { redirect } from "react-router";

import { deleteSession } from "../lib/auth.server";
import { clearCookieHeader, getCookie } from "../lib/cookies.server";
import { webAppUrl } from "../lib/web-app.server";
import type { Route } from "./+types/logout";

export function loader() {
  throw redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  const sessionId = getCookie(request, "__auth");
  if (sessionId) await deleteSession(sessionId);
  throw redirect(webAppUrl("/login"), {
    headers: { "Set-Cookie": clearCookieHeader("__auth") },
  });
}
