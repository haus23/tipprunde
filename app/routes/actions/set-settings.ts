import { data } from "react-router";
import * as v from "valibot";

import { settingsSchema } from "~/lib/prefs/settings";
import {
  commitPrefsSession,
  getPrefsSession,
} from "~/lib/prefs/session.server";

import type { Route } from "./+types/set-settings";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const settings = v.parse(settingsSchema, Object.fromEntries(formData));

  const session = await getPrefsSession(request);
  session.set("settings", { ...session.get("settings"), ...settings });

  return data(null, {
    headers: { "Set-Cookie": await commitPrefsSession(session) },
  });
}
