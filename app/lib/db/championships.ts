import type { InsertableChampionship } from "../model/championship";
import { db } from "./_db.server";

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
