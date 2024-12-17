import { data } from 'react-router';
import * as v from 'valibot';

import {
  commitPrefsSession,
  destroyPrefsSession,
  getPrefsSession,
} from '#/utils/.server/sessions';
import { themeSchema } from '#/utils/theme/schema';

import type { Route } from './+types/set-theme';

export async function loader() {
  throw new Response('Not found', { status: 404 });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const parsedTheme = v.safeParse(themeSchema, Object.fromEntries(formData));

  const session = await getPrefsSession(request);
  let cookie: string;
  if (parsedTheme.success) {
    session.set('theme', parsedTheme.output);
    cookie = await commitPrefsSession(session);
  } else {
    cookie = await destroyPrefsSession(session);
  }

  return data(null, { headers: { 'Set-Cookie': cookie } });
}
