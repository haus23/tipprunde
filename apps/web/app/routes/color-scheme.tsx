import { data } from "react-router";
import * as v from "valibot";

import { COLOR_SCHEME_COOKIE, COLOR_SCHEME_MAX_AGE, COLOR_SCHEMES } from "#/lib/color-scheme.ts";
import { clearCookieHeader, cookieHeader } from "#/lib/cookies.server.ts";

import type { Route } from "./+types/color-scheme";

/** Shared by both shells — public routes and the manager alike. */
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const scheme = v.parse(v.picklist(COLOR_SCHEMES), formData.get("scheme"));

  // "system" is the default — drop the cookie so absence means system.
  const header =
    scheme === "system"
      ? clearCookieHeader(COLOR_SCHEME_COOKIE)
      : cookieHeader(COLOR_SCHEME_COOKIE, scheme, { maxAge: COLOR_SCHEME_MAX_AGE });

  return data(null, { headers: { "Set-Cookie": header } });
}
