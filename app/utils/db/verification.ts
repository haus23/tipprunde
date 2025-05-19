import { eq } from 'drizzle-orm';

import app from '~/app';
import { verifications } from '~/database/schema';

export async function createOrUpdateVerification({
  email,
  expiresAt,
  period,
  digits,
  secret,
  charSet,
  algorithm,
}: typeof verifications.$inferInsert) {
  const { db } = app;

  await db
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
}

export async function getVerificationByEmail(email: string) {
  const { db } = app;
  return db.query.verifications.findFirst({
    where: (v, { eq }) => eq(v.email, email),
  });
}

export async function updateVerification(email: string, attempts: number) {
  const { db } = app;
  return db
    .update(verifications)
    .set({
      attempts,
      updatedAt: new Date(),
    })
    .where(eq(verifications.email, email));
}
