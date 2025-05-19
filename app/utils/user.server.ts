/*
 * This file contains the auth state functions
 *
 * - getUser(): called by the root loader, returns logged-in user or null
 * - requireAnonymous(): loader/action guard
 * - requireManager(): loader/action guard
 *
 */

import { redirect } from 'react-router';

import { deleteSession, getSession } from '~/utils/db/session';
import { getUserById } from '~/utils/db.queries.server';
import { destroyAuthSession, getAuthSession } from '~/utils/sessions.server';

/**
 * Validates app session and returns logged-in user or null.
 * In case of an invalid session, all session data will be deleted.
 *
 * This function is the main authentication point, it is only called from the root loader.
 *
 * @param request Request Object
 * @returns User or null
 */
export async function getUser(request: Request) {
  const authSession = await getAuthSession(request);
  const sessionId = authSession.get('sessionId');

  // No client session? Exit early
  if (!sessionId) {
    return {
      user: null,
      headers: null,
    };
  }

  const session = await getSession(sessionId);

  // No server session? Log the user out from the client and exit
  if (!session) {
    return {
      user: null,
      headers: {
        'Set-Cookie': await destroyAuthSession(authSession),
      },
    };
  }

  // Load associated user
  const user = await getUserById(session.userId);

  // No user or expired server session? Destroy server session and log user out from the client
  // This covers the rare case that the user account is already deleted, but there is still a browser session
  if (!user || new Date() > session.expirationDate) {
    await deleteSession(sessionId);
    return {
      user: null,
      headers: {
        'Set-Cookie': await destroyAuthSession(authSession),
      },
    };
  }

  return {
    user,
    headers: null,
  };
}

/**
 * Loads user - may be identified by session from db
 *
 * @param request Request object
 * @returns User or null
 */
async function getOptionalUser(request: Request) {
  const authSession = await getAuthSession(request);
  const sessionId = authSession.get('sessionId');

  if (!sessionId) return null;

  const session = await getSession(sessionId);

  return session ? await getUserById(session.userId) : null;
}

/**
 * Ensures no logged-in user
 *
 * @param request Request object
 */
export async function requireAnonymous(request: Request) {
  const user = await getOptionalUser(request);
  if (user) throw redirect('/');
}

/**
 * Ensures logged-in user is manager
 *
 * @param request Request object
 */
export async function requireAdmin(request: Request) {
  const user = await getOptionalUser(request);
  if (!user?.roles.includes('ADMIN')) {
    throw redirect('/login');
  }
}
