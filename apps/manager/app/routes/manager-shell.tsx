import { data } from "react-router";
import * as v from "valibot";

import { cookieHeader } from "#/lib/cookies.server.ts";

import type { Route } from "./+types/manager-shell";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const collapsed = v.parse(v.picklist(["true", "false"]), formData.get("collapsed"));
  return data(null, { headers: { "Set-Cookie": cookieHeader("__manager-sidebar", collapsed) } });
}
