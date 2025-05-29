import app from '~/app';
import { getUserCount } from '~/utils/db/user';
import { getLegacyUsers } from '~/utils/legacy-api/shared-data.server';

type SharedDataResources = 'users';

export async function getSyncState() {
  const { kvLegacySync } = app;

  const syncState = {
    sharedData: [] as SharedDataResources[]
  }

  const lastUsersSyncDateStr = await kvLegacySync.get('users');
  const userCount = await getUserCount();

  if (!lastUsersSyncDateStr || userCount === 0) {
    syncState.sharedData.push('users');
  } else {
    const legacyUsers = await getLegacyUsers();
    const lastUserSync = new Date(lastUsersSyncDateStr);

    const hasUpdatedUsers = legacyUsers.some((u) => {
      return !!u.updated_at && u.updated_at > lastUserSync;
    });
    if (hasUpdatedUsers) syncState.sharedData.push('users');
  }

  return syncState;
}
