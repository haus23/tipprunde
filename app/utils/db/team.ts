import app from '~/app';
import { teams } from '~/database/schema';

export async function getTeamsCount() {
  const { db } = app;
  return db.$count(teams);
}
