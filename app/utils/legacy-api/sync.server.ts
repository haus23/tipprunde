import app from '~/app';
import { createOrUpdateLegacyTeam } from '~/utils/db/team';
import { createOrUpdateLegacyUser } from '~/utils/db/user';

import { getLegacyTeams, getLegacyUsers } from './shared-data.server';

export async function syncUsers() {
  const { kvLegacySync } = app;

  const lastUsersSyncDate = await kvLegacySync.get('users');
  const legacyUsers = await getLegacyUsers();

  const usersSyncDate = new Date().toISOString();

  const updatedUsers = lastUsersSyncDate
    ? legacyUsers.filter(
        (u) => !!u.updated_at && u.updated_at > new Date(lastUsersSyncDate),
      )
    : legacyUsers;

  await Promise.all(
    updatedUsers.map((u) =>
      createOrUpdateLegacyUser({
        name: u.name,
        email: u.email,
        slug: u.id,
        roles: [u.role].join(' '),
      }),
    ),
  );

  await kvLegacySync.put('users', usersSyncDate);
}

export async function syncTeams() {
  const { kvLegacySync } = app;

  const lastTeamsSyncDate = await kvLegacySync.get('teams');
  const legacyTeams = await getLegacyTeams();

  const teamsSyncDate = new Date().toISOString();

  const updatedTeams = lastTeamsSyncDate
    ? legacyTeams.filter(
        (t) => !!t.updated_at && t.updated_at > new Date(lastTeamsSyncDate),
      )
    : legacyTeams;

  await Promise.all(
    updatedTeams.map((t) =>
      createOrUpdateLegacyTeam({
        name: t.name,
        shortname: t.shortname,
        slug: t.id,
      }),
    ),
  );

  await kvLegacySync.put('teams', teamsSyncDate);
}
