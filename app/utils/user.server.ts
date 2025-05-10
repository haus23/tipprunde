import { redirect } from 'react-router';

import { getAuthSession } from '~/utils/sessions.server';

/**
 * Loads user from db - identified by session
 *
 * @param request Request object
 * @returns User or null
 */
async function getOptionalUser(request: Request) {
  const authSession = await getAuthSession(request);
  const sessionId = authSession.get('sessionId');

  return null;
}

/**
 * Ensures logged-in user is manager
 *
 * @param request Request object
 */
export async function requireManager(request: Request) {
  const user = await getOptionalUser(request);

  throw redirect('/login');
}
