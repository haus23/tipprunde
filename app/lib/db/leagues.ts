import type { InsertableLeague, League, UpdatableLeague } from "../model/league";
import { db } from "./_db.server";

export function getLeagueById(id: string) {
  const stmt = db.prepare<[string], League>("SELECT * FROM leagues WHERE id = ?");
  return stmt.get(id) ?? null;
}

export function getLeagues() {
  const stmt = db.prepare<[], League>("SELECT * FROM leagues ORDER BY name");
  return stmt.all();
}

export function createLeague({ id, name, shortname = null }: InsertableLeague) {
  const stmt = db.prepare(`
    INSERT INTO leagues (id, name, shortname)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, name, shortname);
}

export function updateLeague({ id, name, shortname = null }: UpdatableLeague) {
  const stmt = db.prepare(`
    UPDATE leagues
    SET name = ?, shortname = ?
    WHERE id = ?
  `);

  stmt.run(name, shortname, id);
}
