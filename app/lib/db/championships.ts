import { db } from "./_db.server";

export function createChampionship(
  id: string,
  name: string,
  nr: number,
  ruleId: string,
) {
  const stmt = db.prepare(`
    INSERT INTO championships (id, name, nr, ruleId)
    VALUES (?, ?, ?, ?)
  `);

  stmt.run(id, name, nr, ruleId);
}
