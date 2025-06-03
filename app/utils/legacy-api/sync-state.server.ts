import * as v from 'valibot';

import app from '~/app';
import { getTeamsCount } from '~/utils/db/team';
import { getUsersCount } from '~/utils/db/user';
import {
  getLegacyTeams,
  getLegacyUsers,
} from '~/utils/legacy-api/shared-data.server';

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
  const usersCount = await getUsersCount();

  if (!lastUsersSyncDateStr || usersCount === 0) {
    updatedResources.push('users');
  } else {
    const legacyUsers = await getLegacyUsers();
    const lastUsersSync = new Date(lastUsersSyncDateStr);

    const hasUpdatedUsers = legacyUsers.some((u) => {
      return !!u.updated_at && u.updated_at > lastUsersSync;
    });
    if (hasUpdatedUsers) updatedResources.push('users');
  }

  const lastTeamsSyncDateStr = await kvLegacySync.get('teams');
  const teamsCount = await getTeamsCount();

  if (!lastTeamsSyncDateStr || teamsCount === 0) {
    updatedResources.push('teams');
  } else {
    const legacyTeams = await getLegacyTeams();
    const lastTeamsSync = new Date(lastTeamsSyncDateStr);

    const hasUpdatedTeams = legacyTeams.some((t) => {
      return !!t.updated_at && t.updated_at > lastTeamsSync;
    });
    if (hasUpdatedTeams) updatedResources.push('teams');
  }

  return { updatedResources } satisfies SharedDataSyncState;
}
