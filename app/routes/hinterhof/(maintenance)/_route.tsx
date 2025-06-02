import type { Route } from './+types/_route';

import { Suspense } from 'react';

import { Collapsible } from '~/components/ui/collapsible';
import {
  SharedData,
  SharedDataPlaceholder,
} from '~/routes/hinterhof/(maintenance)/-shared-data';
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
    <div className="flex flex-col gap-y-6 px-2 sm:px-0">
      <h1 className="font-medium text-2xl">Wartung</h1>
      <Collapsible title="Stammdaten">
        <Suspense fallback={<SharedDataPlaceholder />}>
          <SharedData syncState={sharedDataSyncState} />
        </Suspense>
      </Collapsible>
    </div>
  );
}
