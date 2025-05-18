import type { Route } from './+types/_route';

import { AccountSchema } from '@haus23/tipprunde-model';
import { Form } from 'react-router';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { users } from '~/database/schema';
import { env } from '~/utils/env.server';
import { dataWithToast } from '~/utils/toast.server';
import { requireAdmin } from '~/utils/user.server';
import app from "~/app";

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);

  const {db} = app;

  const response = await fetch(`${env.UNTERBAU_URL}/api/v1/accounts`);
  const data = await response.json();
  const legacyUsers = v.parse(v.array(AccountSchema), data);

  await Promise.all(
    legacyUsers.map(async (u) => {
      await db
        .insert(users)
        .values({ name: u.name, email: u.email, slug: u.id });
    }),
  );

  return dataWithToast(request, null, {
    type: 'success',
    message: 'Synced users',
  });
}

export default function MaintenanceRoute() {
  return (
    <div>
      <h1 className="font-medium text-2xl">Wartung</h1>
      <Form method="POST">
        <Button type="submit" variant="primary">
          Sync Users
        </Button>
      </Form>
    </div>
  );
}
