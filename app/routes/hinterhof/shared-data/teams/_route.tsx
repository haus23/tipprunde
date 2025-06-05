import type { TeamInsert } from '~/database/types';
import type { Route } from './+types/_route';

import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import { useSubmit } from 'react-router';
import * as v from 'valibot';

import { Button } from '~/components/ui/button';
import { DataTable } from '~/components/ui/data-table';
import { Form } from '~/components/ui/form';
import { Sheet } from '~/components/ui/sheet';
import { TextField } from '~/components/ui/text-field';
import { teamInsertSchema } from '~/database/types';
import { createTeam, getTeams, updateTeam } from '~/utils/db/team';
import { slugify } from '~/utils/misc';
import { dataWithToast } from '~/utils/toast.server';
import { requireAdmin } from '~/utils/user.server';

import { actions, columns } from './column-defs';

export function meta() {
  return [{ title: 'Hinterhof - runde.tips' }];
}

export async function action({ request }: Route.ActionArgs) {
  await requireAdmin(request);

  const formData = await request.formData();

  const team = v.parse(teamInsertSchema, {
    ...Object.fromEntries(formData),
  });

  if (team.id) {
    await updateTeam(team.id, team);
  } else {
    await createTeam(team);
  }

  return dataWithToast(request, null, {
    type: 'success',
    message: `${team.shortname} gespeichert`,
  });
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAdmin(request);

  const teams = await getTeams();
  return { teams };
}

const defaultTeam: TeamInsert = {
  slug: '',
  name: '',
  shortname: '',
};

export default function TeamsRoute({ loaderData }: Route.ComponentProps) {
  const [isDlgOpen, setIsDlgOpen] = useState(false);

  const submit = useSubmit();
  const form = useForm({
    defaultValues: defaultTeam,
    onSubmit: async ({ value }) => {
      setIsDlgOpen(false);
      await submit(value, { method: 'post' });
    },
  });

  function createNewTeam() {
    form.reset();
    setIsDlgOpen(true);
  }

  useEffect(() => {
    actions.onEditClick = ({ id, name, shortname, slug }) => {
      form.reset({ id, name, shortname, slug }, { keepDefaultValues: true });
      setIsDlgOpen(true);
    };
  }, [form]);

  return (
    <div>
      <div className="mx-2 flex items-center justify-between sm:mx-0">
        <h1 className="font-medium text-2xl">Teams</h1>
        <Button onPress={createNewTeam} variant="default">
          Neues Team
        </Button>
      </div>
      <div className="mt-4 overflow-clip sm:rounded-xl sm:border">
        <DataTable
          columns={columns}
          data={loaderData.teams}
          withFilter
          withPagination
        />
      </div>
      <Sheet
        isOpen={isDlgOpen}
        onOpenChange={setIsDlgOpen}
        title={form.state.values.id ? 'Team bearbeiten' : 'Neues Team'}
      >
        <Form
          method="post"
          onSubmit={async (e) => {
            e.preventDefault();
            await form.handleSubmit();
          }}
          className="flex flex-col gap-y-4"
        >
          <form.Field name="slug">
            {(field) => (
              <TextField
                label="Kennung"
                isDisabled={!!form.state.values.id}
                isRequired
                name={field.name}
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                validate={(value) =>
                  loaderData.teams.some((t) => t.slug === value)
                    ? 'Diese Kennung ist bereits vergeben'
                    : null
                }
              />
            )}
          </form.Field>
          <form.Field
            name="shortname"
            listeners={{
              onBlur: ({ value }) => {
                if (!form.state.fieldMeta.slug.isDirty) {
                  form.setFieldValue('slug', slugify(value), {
                    dontUpdateMeta: true,
                  });
                }
              },
            }}
          >
            {(field) => (
              <TextField
                label="Kurzform"
                isRequired
                autoFocus
                name={field.name}
                defaultValue={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
          <form.Field name="name">
            {(field) => (
              <TextField
                label="Name"
                isRequired
                name={field.name}
                defaultValue={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
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
