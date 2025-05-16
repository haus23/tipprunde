import { getAppSession } from '~/utils/sessions.server';

export async function getTheme(request: Request) {
  const session = await getAppSession(request);
  return session.get('theme');
}

export async function getSettings(request: Request) {
  const session = await getAppSession(request);
  return session.get('settings');
}
