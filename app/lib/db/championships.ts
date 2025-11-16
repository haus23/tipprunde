import type { Championship, InsertableChampionship } from "../model/championship";
import { db } from "./_db.server";

export function getChampionshipById(id: string) {
  const stmt = db.prepare<[string], Championship>(
    "SELECT * FROM championships WHERE id = ?",
  );
  return stmt.get(id) ?? null;
}

export function createChampionship({
  id,
  name,
  nr,
  ruleId,
  published = 0,
  completed = 0,
  extraPointsPublished = 0,
}: InsertableChampionship) {
  const stmt = db.prepare(`
    INSERT INTO championships (id, name, nr, ruleId, published, completed, extraPointsPublished)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(id, name, nr, ruleId, published, completed, extraPointsPublished);
}
