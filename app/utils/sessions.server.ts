import type { Session } from 'react-router';
import type { Toast } from '~/utils/toast';

import { createCookie, createCookieSessionStorage } from 'react-router';

import { env } from '~/utils/env.server';

type AppSessionData = unknown;
type AppSessionFlashData = {
  toast: Toast;
};

const appSessionStorage = createCookieSessionStorage<
  AppSessionData,
  AppSessionFlashData
>({
  cookie: {
    name: '__app',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.APP_SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
});

const appSessionHelpers = {
  commitAppSession: (session: Session) =>
    appSessionStorage.commitSession(session, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // One year
    }),
  destroyAppSession: appSessionStorage.destroySession,
  getAppSession: (request: Request) =>
    appSessionStorage.getSession(request.headers.get('Cookie')),
};

export const { getAppSession, commitAppSession, destroyAppSession } = {
  ...appSessionHelpers,
};

type AuthSessionData = {
  sessionId: string;
};

type AuthSessionFlashData = {
  email: string;
  rememberMe: boolean;
};

export const authCookie = createCookie('__auth', {
  sameSite: 'lax',
  path: '/',
  httpOnly: true,
  secrets: [env.AUTH_SESSION_SECRET],
  secure: env.NODE_ENV === 'production',
});

const authSessionStorage = createCookieSessionStorage<
  AuthSessionData,
  AuthSessionFlashData
>({
  cookie: authCookie,
});

const authSessionHelpers = {
  commitAuthSession: authSessionStorage.commitSession,
  destroyAuthSession: authSessionStorage.destroySession,
  getAuthSession: (request: Request) =>
    authSessionStorage.getSession(request.headers.get('Cookie')),
};

export const { getAuthSession, commitAuthSession, destroyAuthSession } = {
  ...authSessionHelpers,
};
