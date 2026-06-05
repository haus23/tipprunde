import { data } from "react-router";
import * as v from "valibot";

import { cookieHeader } from "#/lib/cookies.server.ts";

import type { Route } from "./+types/color-scheme";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const scheme = v.parse(v.picklist(["light", "dark"]), formData.get("scheme"));
  return data(null, { headers: { "Set-Cookie": cookieHeader("__color-scheme", scheme) } });
}
