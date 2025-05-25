import app from '~/app';
import { getUserCount } from '~/utils/db/user';
import { getLegacyUsers } from '~/utils/legacy-api/shared-data.server';

export async function getSyncState() {
  const { kvLegacySync } = app;

  const syncState = {
    usersInSync: true,
  };

  const lastUsersSyncDateStr = await kvLegacySync.get('users');
  const userCount = await getUserCount();
  console.log(lastUsersSyncDateStr);

  if (!lastUsersSyncDateStr || userCount === 0) {
    syncState.usersInSync = false;
  } else {
    const legacyUsers = await getLegacyUsers();
    const lastUserSync = new Date(lastUsersSyncDateStr);

    const hasUpdatedUsers = legacyUsers.some((u) => {
      return !!u.updated_at && u.updated_at > lastUserSync;
    });
    syncState.usersInSync = !hasUpdatedUsers;
  }

  return syncState;
}
