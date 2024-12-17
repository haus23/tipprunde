import { createCookieSessionStorage } from 'react-router';

import type { Theme } from '../theme/schema';
import { env } from './env';

const prefsSessionStorage = createCookieSessionStorage<{ theme: Theme }>({
  cookie: {
    name: '__prefs',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [env.PREFS_SESSION_SECRET],
    secure: env.NODE_ENV === 'production',
  },
});

const prefsSession = {
  commitPrefsSession: prefsSessionStorage.commitSession,
  destroyPrefsSession: prefsSessionStorage.destroySession,
  getPrefsSession: (request: Request) =>
    prefsSessionStorage.getSession(request.headers.get('Cookie')),
};

export const { getPrefsSession, commitPrefsSession, destroyPrefsSession } = {
  ...prefsSession,
};
