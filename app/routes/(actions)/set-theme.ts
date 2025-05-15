import type { Route } from './+types/set-theme';

import { data } from 'react-router';
import * as v from 'valibot';

import { commitAppSession, getAppSession } from '~/utils/sessions.server';
import { themeSchema } from '~/utils/theme';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const theme = v.parse(themeSchema, Object.fromEntries(formData));

  const session = await getAppSession(request);
  session.set('theme', theme);

  return data(null, {
    headers: { 'Set-Cookie': await commitAppSession(session) },
  });
}
