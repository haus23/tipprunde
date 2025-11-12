import { db } from "./_db.server";
import type { Verification } from "./_types";

type CreateVerificationData = Omit<
  Verification,
  "attempts" | "createdAt" | "updatedAt"
>;

export function createVerification(data: CreateVerificationData) {
  const stmt = db.prepare(`
    INSERT INTO verifications (
      userId, identifier, secret, algorithm, digits, period, charSet, expiresAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(userId) DO UPDATE SET
      identifier = excluded.identifier,
      secret = excluded.secret,
      algorithm = excluded.algorithm,
      digits = excluded.digits,
      period = excluded.period,
      charSet = excluded.charSet,
      expiresAt = excluded.expiresAt,
      attempts = 0
  `);

  stmt.run(
    data.userId,
    data.identifier,
    data.secret,
    data.algorithm,
    data.digits,
    data.period,
    data.charSet,
    data.expiresAt,
  );
}

export function updateVerification(identifier: string, attempts: number) {
  const stmt = db.prepare(`
    UPDATE verifications
    SET attempts = ?
    WHERE identifier = ?
  `);

  stmt.run(attempts, identifier);
}

export function getVerificationByIdentifier(identifier: string) {
  const stmt = db.prepare<[string], Verification>(
    "SELECT * FROM verifications WHERE identifier = ?",
  );
  return stmt.get(identifier) ?? null;
}
