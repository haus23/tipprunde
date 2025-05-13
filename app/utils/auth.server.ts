import { env } from '~/utils/env.server';
import { createLoginCode } from '~/utils/totp.server';

import { sendCodeMail, sendErrorMail } from './email.server';

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
  await sendCodeMail({ userName: user.name, code, email });
}
