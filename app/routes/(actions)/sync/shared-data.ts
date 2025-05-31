import type { Route } from './+types/shared-data';

import { syncUsers } from '~/utils/legacy-api/sync.server';
import { dataWithToast } from '~/utils/toast.server';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  switch (formData.get('intent')) {
    case 'users':
      await syncUsers();
      return dataWithToast(request, null, {
        type: 'success',
        message: 'Synced users',
      });
  }
}
