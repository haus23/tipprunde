import type { Route } from './+types/shared-data';

import * as v from 'valibot';

import { syncUsers } from '~/utils/legacy-api/sync.server';
import { sharedDataResourcesSchema } from '~/utils/legacy-api/sync-state.server';
import { dataWithToast } from '~/utils/toast.server';

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  const resource = v.safeParse(sharedDataResourcesSchema, intent);
  if (!resource.success) {
    throw new Error('Invalid resource');
  }

  switch (resource.output) {
    case 'users':
      await syncUsers();
      return dataWithToast(request, null, {
        type: 'success',
        message: 'Spielerdaten abgeglichen.',
      });
  }
}
