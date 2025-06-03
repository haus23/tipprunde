import { asc } from 'drizzle-orm';

import app from '~/app';
import { teams } from '~/database/schema';

export async function getTeams() {
  const { db } = app;
  return db.query.teams.findMany({ orderBy: [asc(teams.shortname)] });
}

export async function getTeamsCount() {
  const { db } = app;
  return db.$count(teams);
}
