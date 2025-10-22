import { deleteSession, getSession } from "./db/sessions";
import { getUserById } from "./db/users";
import { destroyAuthSession, getAuthSession } from "./sessions.server";

/**
 * Validates auth session and returns logged-in user or null.
 * In case of an invalid session, all session data will be deleted.
 *
 * This function is the main authentication point, it is only called in the root middleware.
 *
 * @param request Request Object
 */
export async function getUser(request: Request) {
  const authSession = await getAuthSession(request);
  const sessionId = authSession.get("sessionId");

  // No client session? Exit early
  if (!sessionId) {
    return {
      user: null,
      authCookieHeader: null,
    };
  }

  const session = await getSession(sessionId);

  // No server session? Log the user out from the client and exit
  if (!session) {
    return {
      user: null,
      authCookieHeader: await destroyAuthSession(authSession),
    };
  }

  // Load associated user
  const user = await getUserById(session.userId);

  // No user or expired server session? Destroy server session and log user out from the client
  // This covers the rare case that the user account is already deleted, but there is still a browser session
  if (!user || new Date() > session.expires) {
    await deleteSession(sessionId);
    return {
      user: null,
      authCookieHeader: await destroyAuthSession(authSession),
    };
  }

  return {
    user,
    authCookieHeader: null,
  };
}
