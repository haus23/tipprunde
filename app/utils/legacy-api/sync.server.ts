import app from '~/app';
import { createOrUpdateUser } from '~/utils/db/user';

import { getLegacyUsers } from './shared-data.server';

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
      createOrUpdateUser({
        name: u.name,
        email: u.email,
        slug: u.id,
        roles: [u.role].join(' '),
      }),
    ),
  );

  await kvLegacySync.put('users', usersSyncDate);
}
