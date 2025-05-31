import type { Route } from './+types/_route';

import { Suspense } from 'react';

import { SharedData } from '~/routes/hinterhof/(maintenance)/-shared-data';
import { getSharedDataSyncState } from '~/utils/legacy-api/sync-state.server';
import { requireAdmin } from '~/utils/user.server';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const sharedDataSyncState = getSharedDataSyncState();

  return { sharedDataSyncState };
}

export default function MaintenanceRoute({ loaderData }: Route.ComponentProps) {
  const { sharedDataSyncState } = loaderData;

  return (
    <div>
      <h1 className="font-medium text-2xl">Wartung</h1>
      <Suspense fallback={<div>Waiting...</div>}>
        <SharedData syncState={sharedDataSyncState} />
      </Suspense>
    </div>
  );
}
