import { generateTOTP } from '@epic-web/totp';

import { verifications } from '~/database/schema';

import { db } from './db.server';
import { env } from './env.server';

/**
 * Generates and stores TOTP login code.
 *
 * @param email User email the code will be associated with
 * @returns Code
 */
export async function createLoginCode(email: string) {
  const { otp, secret, period, charSet, digits, algorithm } =
    await generateTOTP({
      period: env.TOTP_PERIOD,
    });

  const expiresAt = new Date(Date.now() + period * 1000);
  await db.instance
    .insert(verifications)
    .values({
      email,
      secret,
      period,
      algorithm,
      digits,
      charSet,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: verifications.email,
      set: {
        secret,
        period,
        algorithm,
        digits,
        charSet,
        expiresAt,
        attempts: 0,
        updatedAt: new Date(),
      },
    });

  return otp;
}
