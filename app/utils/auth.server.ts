/*
 * The main auth flow functions
 *
 * - prepareOnboarding(): validates onboarding email and sends TOTP and magic link via email
 * - ensureOnboarding(): ensures ongoing boarding
 * - verifyOnboardingCode(): validates TOTP and logs user in
 * - logout(): logs user out
 */

import { eq } from 'drizzle-orm';

import { sessions } from '~/database/schema';
import { getUserByEmail } from '~/utils/db.queries.server';
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
    '/kontrolle',
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

/**
 * Performs user logout and redirects to referer or home if no referer is available.
 *
 * @param request Request object
 */
export async function logout(request: Request) {
  const session = await getAuthSession(request);
  const sessionId = session.get('sessionId');

  if (sessionId) {
    await db.instance.delete(sessions).where(eq(sessions.id, sessionId));
  }

  const headers = new Headers({
    'Set-Cookie': await destroyAuthSession(session),
  });

  const redirectUrl = request.headers.get('Referer') || '/';
  throw await redirectWithToast(
    request,
    redirectUrl,
    { type: 'info', message: 'Du bist abgemeldet. Bis bald mal wieder.' },
    {
      headers,
    },
  );
}
