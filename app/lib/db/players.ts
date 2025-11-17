import type { User } from "../model/user";
import { db } from "./_db.server";

export type Player = {
  userId: number;
  championshipId: string;
  tipPoints: number;
  totalPoints: number;
  rank: number | null;
  createdAt: string;
  updatedAt: string;
};

export type PlayerWithUser = Player & {
  userName: string;
  userSlug: string;
};

export function getChampionshipPlayers(championshipId: string) {
  const stmt = db.prepare<[string], PlayerWithUser>(`
    SELECT
      p.*,
      u.name as userName,
      u.slug as userSlug
    FROM players p
    INNER JOIN users u ON p.userId = u.id
    WHERE p.championshipId = ?
    ORDER BY u.name
  `);
  return stmt.all(championshipId);
}

export function getAvailableUsers(championshipId: string) {
  const stmt = db.prepare<[string], User>(`
    SELECT u.*
    FROM users u
    WHERE u.id NOT IN (
      SELECT userId
      FROM players
      WHERE championshipId = ?
    )
    ORDER BY u.name
  `);
  return stmt.all(championshipId);
}

export function addPlayerToChampionship(
  userId: number,
  championshipId: string,
) {
  const stmt = db.prepare(`
    INSERT INTO players (userId, championshipId)
    VALUES (?, ?)
  `);
  stmt.run(userId, championshipId);
}

export function removePlayerFromChampionship(
  userId: number,
  championshipId: string,
) {
  const stmt = db.prepare(`
    DELETE FROM players
    WHERE userId = ? AND championshipId = ?
  `);
  stmt.run(userId, championshipId);
}
