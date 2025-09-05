import { createCookieSessionStorage } from "react-router";
import * as v from "valibot";

import { UserPreferencesSchema, type UserPreferences } from "./user-prefs";

// Create session storage for user preferences
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<UserPreferences>({
    cookie: {
      name: "__prefs",
      httpOnly: true, // Server-only access for security
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  });

export async function getUserPreferences(
  request: Request,
): Promise<UserPreferences> {
  const session = await getSession(request.headers.get("Cookie"));

  // Parse and validate session data with defaults
  const preferences = v.parse(UserPreferencesSchema, session.data);

  return preferences;
}

export async function setUserPreference<K extends keyof UserPreferences>(
  request: Request,
  key: K,
  value: UserPreferences[K],
): Promise<string> {
  const session = await getSession(request.headers.get("Cookie"));
  session.set(key, value);
  return await commitSession(session);
}

export { getSession, commitSession, destroySession };
