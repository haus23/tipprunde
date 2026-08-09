import { db } from "#/lib/db.server.ts";

/**
 * Edit lock — mutations must be rejected when the championship or the round is
 * `completed`. This is the authoritative server-side guard; the UI mirrors it
 * (LockProvider) but cannot be trusted. `completed` is the only flag that locks.
 */
export function isLocked(flags: {
  championshipCompleted: boolean;
  roundCompleted?: boolean | null;
}): boolean {
  return Boolean(flags.championshipCompleted || flags.roundCompleted);
}

/**
 * Loads a round scoped to its championship — for actions that only carry a
 * roundId. Returns `undefined` when the round does not belong to the
 * championship (doubles as an ownership check).
 */
export function getRound(roundId: number, championshipId: number) {
  return db.query.rounds.findFirst({
    where: { id: roundId, championshipId },
    columns: { id: true, completed: true },
  });
}
