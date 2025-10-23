import { createCookieSessionStorage } from "react-router";
import { env } from "./env.server";

// The Auth Session
//

type AuthSessionData = {
  sessionId: string;
};

type AuthSessionFlashData = {
  email: string;
  rememberMe: boolean;
};

const authSessionStorage = createCookieSessionStorage<
  AuthSessionData,
  AuthSessionFlashData
>({
  cookie: {
    name: "__auth",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [env.AUTH_SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

const authSessionHelpers = {
  commitAuthSession: authSessionStorage.commitSession,
  destroyAuthSession: authSessionStorage.destroySession,
  getAuthSession: (request: Request) =>
    authSessionStorage.getSession(request.headers.get("Cookie")),
};

export const { getAuthSession, commitAuthSession, destroyAuthSession } = {
  ...authSessionHelpers,
};
