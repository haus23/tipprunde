import type { Session } from "react-router";
import { createCookieSessionStorage } from "react-router";
import { env } from "~/utils/env.server";

import type { Settings } from "./settings";

type PrefsSessionData = {
  settings: Settings;
};

const prefsSessionStorage = createCookieSessionStorage<PrefsSessionData>({
  cookie: {
    name: "__prefs",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [env.PREFS_SESSION_SECRET],
    secure: env.NODE_ENV === "production",
  },
});

const prefsSessionHelpers = {
  commitPrefsSession: (session: Session) =>
    prefsSessionStorage.commitSession(session, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // One year
    }),
  destroyPrefsSession: prefsSessionStorage.destroySession,
  getPrefsSession: (request: Request) =>
    prefsSessionStorage.getSession(request.headers.get("Cookie")),
};

export const { getPrefsSession, commitPrefsSession, destroyPrefsSession } = {
  ...prefsSessionHelpers,
};
