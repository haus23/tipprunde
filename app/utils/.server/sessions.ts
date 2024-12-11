import { createCookieSessionStorage } from 'react-router';
import type { Theme } from '../theme/theme';

const prefsSessionStorage = createCookieSessionStorage<{ theme: Theme }>({
  cookie: {
    name: '__prefs',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env.SESSION_SECRET || 'V3ryStrang3S3cr3t'],
    secure: process.env.NODE_ENV === 'production',
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
