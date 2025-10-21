import { db } from "./_db.server";
import type { VerificationCreateInput } from "../prisma/models";

/**
 * Creates verification data to validate a totp
 *
 * @param verification - Verification data
 */
export async function createVerification(
  verification: VerificationCreateInput,
) {
  await db.verification.upsert({
    where: { email: verification.email },
    create: { ...verification, attempts: 0 },
    update: { ...verification, attempts: 0 },
  });
}

/**
 * Loads verification data for email address
 *
 * @param email - Email address
 */
export async function getVerificationByEmail(email: string) {
  return db.verification.findFirst({
    where: { email },
  });
}

/**
 * Updates verification data for email address
 *
 * @param email - Email address
 * @param attempts - Number of attempts the code is entered
 */
export async function updateVerification(email: string, attempts: number) {
  return db.verification.update({ where: { email }, data: { attempts } });
}
