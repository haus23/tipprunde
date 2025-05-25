import type { Route } from './+types/_route';

import { Form } from 'react-router';

import { Button } from '~/components/ui/button';
import { syncUsers } from '~/utils/legacy-api/sync.server';
import { getSyncState } from '~/utils/legacy-api/sync-state.server';
import { dataWithToast } from '~/utils/toast.server';
import { requireAdmin } from '~/utils/user.server';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
  const syncState = await getSyncState();

  return { syncState };
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);

  await syncUsers();

  return dataWithToast(request, null, {
    type: 'success',
    message: 'Synced users',
  });
}

export default function MaintenanceRoute({ loaderData }: Route.ComponentProps) {
  const { syncState } = loaderData;

  return (
    <div>
      <h1 className="font-medium text-2xl">Wartung</h1>
      <Form method="POST">
        <Button
          isDisabled={syncState.usersInSync}
          variant="primary"
          type="submit"
        >
          Sync Users
        </Button>
      </Form>
    </div>
  );
}
