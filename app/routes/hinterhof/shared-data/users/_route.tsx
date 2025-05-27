import type * as React from 'react';
import type { UserInsert } from '~/database/types';
import type { Route } from './+types/_route';

import { useCallback, useEffect, useState } from 'react';
import { useSubmit } from 'react-router';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { DataTable } from '~/components/ui/data-table';
import { Form } from '~/components/ui/form';
import { Sheet } from '~/components/ui/sheet';
import { TextField } from '~/components/ui/text-field';
import { userInsertSchema } from '~/database/types';
import {
  actions,
  columns,
} from '~/routes/hinterhof/shared-data/users/column-defs';
import { createUser, getUsers, updateUser } from '~/utils/db/user';
import { slugify } from '~/utils/misc';
import { dataWithToast } from '~/utils/toast.server';
import { requireAdmin } from '~/utils/user.server';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();
  const isAdmin = String(formData.get('isAdmin')) === 'on';
  console.log(formData.get('id'));

  const user = v.parse(userInsertSchema, {
    ...Object.fromEntries(formData),
    roles: isAdmin ? 'ADMIN' : '',
  });

  if (user.id) {
    await updateUser(user.id, user);
  } else {
    await createUser(user);
  }

  return dataWithToast(request, null, {
    type: 'success',
    message: `${user.name} gespeichert`,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);

  const users = await getUsers();
  return { users };
}

export default function UsersRoute({ loaderData }: Route.ComponentProps) {
  const [isDlgOpen, setIsDlgOpen] = useState(false);

  const [currentUser, setCurrentUser] = useState<UserInsert | null>(null);

  // We use a controlled field for the slug and an extra dirty state
  const [slug, setSlug] = useState('');
  const [isSlugDirty, setSlugDirty] = useState(false);

  const setUser = useCallback((user: UserInsert | null) => {
    setCurrentUser(user);
    setSlug(user?.slug || '');
    setSlugDirty(false);
  }, []);

  const submit = useSubmit();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsDlgOpen(false);
    e.preventDefault();
    await submit(e.currentTarget);
  };

  useEffect(() => {
    actions.onEditClick = (user) => {
      setUser(user);
      setIsDlgOpen(true);
    };
  }, [setUser]);

  function createUser() {
    setUser(null);
    setIsDlgOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-medium text-2xl">Spieler</h1>
        <Button variant="default" onPress={createUser}>
          Neuer Spieler
        </Button>
      </div>
      <div className="mt-4 overflow-clip rounded-xl border">
        <DataTable
          columns={columns}
          data={loaderData.users}
          withFilter
          withPagination
        />
      </div>
      <Sheet
        isOpen={isDlgOpen}
        onOpenChange={setIsDlgOpen}
        title={currentUser?.id ? 'Spieler bearbeiten' : 'Neuer Spieler'}
      >
        <Form
          onSubmit={onSubmit}
          method="post"
          className="flex flex-col gap-y-4"
        >
          <input type="hidden" name="id" defaultValue={currentUser?.id} />
          {currentUser?.id && (
            <input type="hidden" name="slug" defaultValue={currentUser.slug} />
          )}
          <TextField
            isDisabled={!!currentUser?.id}
            label="Kennung"
            name="slug"
            isRequired
            value={slug}
            onInput={() => setSlugDirty(true)}
            onChange={setSlug}
            validate={(value) =>
              loaderData.users.some((u) => u.slug === value)
                ? 'Diese Kennung ist bereits vergeben'
                : null
            }
          />
          <TextField
            label="Name"
            autoFocus
            name="name"
            isRequired
            defaultValue={currentUser?.name}
            onBlur={(e) => {
              if (!isSlugDirty) {
                setSlug(slugify(e.currentTarget.value));
              }
            }}
          />
          <TextField
            label="Email"
            type="email"
            name="email"
            defaultValue={currentUser?.email}
          />
          <Checkbox
            name="isAdmin"
            defaultSelected={currentUser?.roles?.includes('ADMIN')}
          >
            Administrator
          </Checkbox>
          <div className="flex gap-x-4 pt-4">
            <Button onPress={() => setIsDlgOpen(false)}>Abbrechen</Button>
            <Button type="submit" variant="primary">
              Speichern
            </Button>
          </div>
        </Form>
      </Sheet>
    </div>
  );
}
