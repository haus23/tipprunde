import type { SharedDataSyncState } from '~/utils/legacy-api/sync-state.server';

import { use } from 'react';
import { useFetcher } from 'react-router';

import { Button } from '~/components/ui/button';

export function SharedData({
  syncState,
}: {
  syncState: Promise<SharedDataSyncState>;
}) {
  const fetcher = useFetcher();
  const state = use(syncState);

  return (
    <div>
      <fetcher.Form method="POST" action="/action/sync/shared-data">
        <div className="flex gap-4">
          <Button
            isDisabled={!state.updatedResources.includes('users')}
            variant="primary"
            type="submit"
            name="intent"
            value="users"
          >
            Spieler
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('teams')}
            variant="primary"
            type="submit"
            name="intent"
            value="teams"
          >
            Teams
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('leagues')}
            variant="primary"
            type="submit"
            name="intent"
            value="leagues"
          >
            Ligen
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('rulesets')}
            variant="primary"
            type="submit"
            name="intent"
            value="rulesets"
          >
            Regelwerke
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
