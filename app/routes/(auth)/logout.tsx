import type { Route } from './+types/logout';

import { redirect } from 'react-router';

import { logout } from '~/utils/auth.server';

export const loader = async () => {
  throw redirect('/');
};

export async function action({ request }: Route.ActionArgs) {
  // Do not stay in the admin area after logout (would be redirected anyway)
  const referer = request.headers.get('Referer');
  const isManagerRoute =
    referer !== null && new URL(referer).pathname.startsWith('/hinterhof');
  if (isManagerRoute) {
    request.headers.delete('Referer');
  }

  await logout(request);
}
