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
