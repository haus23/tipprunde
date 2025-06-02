import type { SharedDataSyncState } from '~/utils/legacy-api/sync-state.server';

import { use } from 'react';
import { useFetcher } from 'react-router';

import { Button } from '~/components/ui/button';

export function SharedDataPlaceholder() {
  return (
    <div className="mt-4 flex animate-pulse flex-col gap-y-4">
      <div className="flex flex-col gap-y-4 px-4">
        <p class="space-y-3">
          <div className="h-2 rounded bg-app-4" />
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-2 rounded bg-app-4" />
            <div className="col-span-1 h-2 rounded bg-app-4" />
          </div>
        </p>
        <p class="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 h-2 rounded bg-app-4" />
            <div className="col-span-2 h-2 rounded bg-app-4" />
          </div>
          <div className="h-2 rounded bg-app-4" />
        </p>
      </div>
      <div className="flex flex-wrap justify-around gap-4">
        <div className="h-[56px] w-32 rounded-md bg-app-4" />
        <div className="h-[56px] w-32 rounded-md bg-app-4" />
        <div className="h-[56px] w-32 rounded-md bg-app-4" />
        <div className="h-[56px] w-32 rounded-md bg-app-4" />
      </div>
    </div>
  );
}

export function SharedData({
  syncState,
}: {
  syncState: Promise<SharedDataSyncState>;
}) {
  const fetcher = useFetcher();
  const state = use(syncState);

  return (
    <div className="mt-4 flex flex-col gap-y-4">
      <div className="flex flex-col gap-y-2 px-4">
        <p className="text-app-11">
          Stammdaten sind die unveränderlichen Daten, die in den jeweiligen
          Turnieren benutzt werden: Spieler, Mannschaften/Teams, Ligen und
          Regelwerke. Diese Daten sind relativ stabil und ändern sich maximal
          bei neuen Runden oder neuen Turnieren.
        </p>
        <p className="text-app-11">
          Solange die Firestore-Datenbank maßgeblich die Daten besitzt, müssen -
          nach Änderungen dieser - die lokalen Daten der Anwendung
          synchronisiert werden.
        </p>
      </div>
      <fetcher.Form method="POST" action="/action/sync/shared-data">
        <div className="flex flex-wrap justify-around gap-4">
          <Button
            isDisabled={!state.updatedResources.includes('users')}
            variant="primary"
            type="submit"
            name="intent"
            value="users"
            className="w-32 justify-center py-4"
          >
            Spieler
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('teams')}
            variant="primary"
            type="submit"
            name="intent"
            value="teams"
            className="w-32 justify-center py-4"
          >
            Teams
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('leagues')}
            variant="primary"
            type="submit"
            name="intent"
            value="leagues"
            className="w-32 justify-center py-4"
          >
            Ligen
          </Button>
          <Button
            isDisabled={!state.updatedResources.includes('rulesets')}
            variant="primary"
            type="submit"
            name="intent"
            value="rulesets"
            className="w-32 justify-center py-4"
          >
            Regelwerke
          </Button>
        </div>
      </fetcher.Form>
    </div>
  );
}
