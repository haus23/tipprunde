import { db } from "./_db.server";
import type { Verification } from "./_types";

type CreateVerificationData = Omit<
  Verification,
  "attempts" | "created_at" | "updated_at"
>;

export function createVerification(data: CreateVerificationData) {
  const stmt = db.prepare(`
    INSERT INTO verifications (
      user_id, identifier, secret, algorithm, digits, period, char_set, expires_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      identifier = excluded.identifier,
      secret = excluded.secret,
      algorithm = excluded.algorithm,
      digits = excluded.digits,
      period = excluded.period,
      char_set = excluded.char_set,
      expires_at = excluded.expires_at,
      attempts = 0
  `);

  stmt.run(
    data.user_id,
    data.identifier,
    data.secret,
    data.algorithm,
    data.digits,
    data.period,
    data.char_set,
    data.expires_at,
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
