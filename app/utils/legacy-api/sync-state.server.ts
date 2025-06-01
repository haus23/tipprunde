import * as v from 'valibot';

import app from '~/app';
import { getUserCount } from '~/utils/db/user';
import { getLegacyUsers } from '~/utils/legacy-api/shared-data.server';

export const sharedDataResourcesSchema = v.picklist([
  'users',
  'teams',
  'leagues',
  'rulesets',
]);
export type SharedDataResource = v.InferOutput<
  typeof sharedDataResourcesSchema
>;

export type SharedDataSyncState = {
  updatedResources: SharedDataResource[];
};

export async function getSharedDataSyncState() {
  const { kvLegacySync } = app;

  const updatedResources: SharedDataResource[] = [];

  const lastUsersSyncDateStr = await kvLegacySync.get('users');
  const userCount = await getUserCount();

  if (!lastUsersSyncDateStr || userCount === 0) {
    updatedResources.push('users');
  } else {
    const legacyUsers = await getLegacyUsers();
    const lastUserSync = new Date(lastUsersSyncDateStr);

    const hasUpdatedUsers = legacyUsers.some((u) => {
      return !!u.updated_at && u.updated_at > lastUserSync;
    });
    if (hasUpdatedUsers) updatedResources.push('users');
  }

  return { updatedResources } satisfies SharedDataSyncState;
}
