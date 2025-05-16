import type { Route } from './+types/set-settings';

import { data } from 'react-router';
import * as v from 'valibot';

import { settingsSchema } from '~/utils/prefs';
import { commitAppSession, getAppSession } from '~/utils/sessions.server';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const settings = v.parse(settingsSchema, Object.fromEntries(formData));

  const session = await getAppSession(request);
  session.set('settings', settings);

  return data(null, {
    headers: { 'Set-Cookie': await commitAppSession(session) },
  });
}
