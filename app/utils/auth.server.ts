import { eq } from 'drizzle-orm';

import { sessions } from '~/database/schema';
import { db } from '~/utils/db.server';
import { env } from '~/utils/env.server';
import {
  commitAuthSession,
  destroyAuthSession,
  getAuthSession,
} from '~/utils/sessions.server';
import { redirectWithToast } from '~/utils/toast.server';
import { createLoginCode, verifyLoginCode } from '~/utils/totp.server';

import { sendCodeMail, sendErrorMail } from './email.server';

/*
 * This file contains the main auth functions
 *
 * Authentication state:
 *
 * - getUser(): called by the root loader, returns logged-in user or null
 *
 * Authentication flow:
 *
 * - prepareOnboarding(): validates onboarding email and sends TOTP and magic link via email
 * - ensureOnboarding(): ensures ongoing boarding
 * - verifyOnboardingCode(): validates TOTP and logs user in
 *
 */

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

  const session = await db.instance.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.id, sessionId),
  });

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
    await db.instance.delete(sessions).where(eq(sessions.id, sessionId));
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
 * Prepares users onboarding. Expects email in request form data.
 *
 * If no valid email address is in the form data, it returns an error.
 * Otherwise, it creates an onboarding code and redirects to the onboarding page
 * to let the user enter the mailed code.
 *
 * @param request Request object
 */
export async function prepareOnboarding(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email'));

  const user = await getUserByEmail(email);
  if (!user) {
    await sendErrorMail({
      subject: 'Login-Fehler mit ungültiger Email-Adresse.',
      msg: `Bei einem Login-Versuch wurde die ungültige Email-Adresse ${email} verwendet.`,
    });
    return {
      errors: { email: 'Unbekannte Email-Adresse. Wende dich an Micha.' },
    };
  }

  const code = await createLoginCode(email);
  console.log(code);
  // await sendCodeMail({ userName: user.name, code, email });

  const session = await getAuthSession(request);
  session.flash('email', email);

  throw await redirectWithToast(
    request,
    '/code',
    {
      type: 'info',
      message:
        'Eine Email mit einem Login-Code wurde an deine Email-Adresse gesendet.',
    },
    {
      headers: {
        'Set-Cookie': await commitAuthSession(session),
      },
    },
  );
}

/**
 * Ensures that there is an ongoing onboarding session.
 *
 * Prevents a route from being called directly
 *
 * @param request Request object
 */
export async function ensureOnboardingSession(request: Request) {
  const session = await getAuthSession(request);
  const email = session.get('email');

  if (!email) {
    throw await redirectWithToast(request, '/login', {
      type: 'error',
      message: 'Kein aktueller Anmeldeversuch. Bitte versuche es erneut.',
    });
  }

  const user = await getUserByEmail(email);
  if (!user) throw Error('Netter Versuch!');
}

/**
 * Performs user login
 *
 * Expects valid email in session and totp code in request.
 * Returns error for invalid data. Logs the user in and redirects to home otherwise.
 *
 * @param request Request object
 * @returns Login errors or redirects
 */
export async function verifyOnboardingCode(request: Request) {
  const session = await getAuthSession(request);
  const email = session.get('email');

  if (!email) {
    throw await redirectWithToast(request, '/login', {
      type: 'error',
      message: 'Kein aktueller Anmeldeversuch. Bitte versuche es erneut.',
    });
  }

  const user = await getUserByEmail(email);
  if (!user) throw Error('Netter Versuch!');

  const formData = await request.formData();
  const code = String(formData.get('code'));

  // Verify code
  const verifyResult = await verifyLoginCode(email, code);
  if (!verifyResult.success) {
    if (!verifyResult.retry) {
      throw await redirectWithToast(
        request,
        '/login',
        {
          type: 'error',
          message: verifyResult.error,
        },
        {
          headers: {
            'Set-Cookie': await commitAuthSession(session),
          },
        },
      );
    }
    return { errors: { code: verifyResult.error } };
  }

  // Create app session
  const expirationDate = new Date(Date.now() + env.SESSION_DURATION * 1000);
  const [sessionData] = await db.instance
    .insert(sessions)
    .values({
      userId: user.id,
      expirationDate,
      expires: true,
    })
    .returning({ sessionId: sessions.id });

  session.set('sessionId', String(sessionData.sessionId));

  throw await redirectWithToast(
    request,
    '/',
    { type: 'success', message: `Hallo ${user.name}! Du bist drin.` },
    {
      headers: {
        'Set-Cookie': await commitAuthSession(session, {}),
      },
    },
  );
}

// Server auth helper functions

/**
 * Gets user by id
 *
 * @param id
 * @returns User or null
 */
async function getUserById(id: number) {
  if (id === 0) {
    return {
      id: 0,
      email: env.ROOT_EMAIL,
      name: 'Root',
      roles: 'root admin manager',
    };
  }

  return null;
}

/**
 * Gets user by email address
 *
 * @param email Known email address
 * @returns User or null if email address is unknown
 */
async function getUserByEmail(email: string) {
  if (email === env.ROOT_EMAIL) {
    return {
      id: 0,
      email: env.ROOT_EMAIL,
      name: 'Root',
      roles: 'root admin manager',
    };
  }

  return null;
}
