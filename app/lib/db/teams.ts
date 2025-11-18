import type { InsertableTeam, Team, UpdatableTeam } from "../model/team";
import { db } from "./_db.server";

export function getTeamById(id: string) {
  const stmt = db.prepare<[string], Team>("SELECT * FROM teams WHERE id = ?");
  return stmt.get(id) ?? null;
}

export function getTeams() {
  const stmt = db.prepare<[], Team>("SELECT * FROM teams ORDER BY name");
  return stmt.all();
}

export function createTeam({ id, name, shortname = null }: InsertableTeam) {
  const stmt = db.prepare(`
    INSERT INTO teams (id, name, shortname)
    VALUES (?, ?, ?)
  `);

  stmt.run(id, name, shortname);
}

export function updateTeam({ id, name, shortname = null }: UpdatableTeam) {
  const stmt = db.prepare(`
    UPDATE teams
    SET name = ?, shortname = ?
    WHERE id = ?
  `);

  stmt.run(name, shortname, id);
}
