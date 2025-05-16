import type { Route } from './+types/login';

import { useSubmit } from 'react-router';

import { Button } from '~/components/ui/button';
import { Checkbox } from '~/components/ui/checkbox';
import { Form } from '~/components/ui/form';
import { TextField } from '~/components/ui/text-field';
import { prepareOnboarding } from '~/utils/auth.server';
import { requireAnonymous } from '~/utils/user.server';

export function meta() {
  return [
    { title: 'Log In - runde.tips' },
    { name: 'description', content: 'Anmeldung bei der Haus23 Tipprunde' },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await requireAnonymous(request);
}

export async function action({ request }: Route.ActionArgs) {
  await requireAnonymous(request);
  return await prepareOnboarding(request);
}

export default function Login({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(e.currentTarget);
  };

  return (
    <div className="px-2 sm:px-0">
      <div className="mx-auto flex max-w-md flex-col gap-y-6 rounded-md border border-app-6 p-4 shadow-md">
        <h1 className="font-medium text-2xl">Log In</h1>
        <Form
          method="post"
          onSubmit={onSubmit}
          validationErrors={actionData?.errors}
          className="flex flex-col gap-y-4"
        >
          <TextField
            name="email"
            type="email"
            isRequired
            label="Email"
            placeholder="Adresse aus der Tipprunde"
          />
          <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
          <Button type="submit" variant="primary">
            Login-Code anfordern
          </Button>
        </Form>
      </div>
    </div>
  );
}
