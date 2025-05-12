import type { Route } from './+types/login';

import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { TextField } from '~/components/ui/text-field';
import {env} from "~/utils/env.server";
import {useSubmit} from "react-router";

export function meta() {
  return [{ title: 'Log In - runde.tips' }];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));

  if(email !== env.ROOT_EMAIL) {
      return {
          errors: {
              email: 'Unbekannte Email-Adresse. Wende dich an Micha.'
          }
      };
  }
}

export default function Login({actionData}: Route.ComponentProps) {
    const submit = useSubmit();
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await submit(e.currentTarget);
    };


  return (
    <div className="mx-auto mt-12 flex max-w-md flex-col gap-y-6 rounded-md border border-app-6 p-4 shadow-md">
      <h1 className="font-medium text-2xl">Log In</h1>
      <Form method='post' onSubmit={onSubmit} validationErrors={actionData?.errors} className="flex flex-col gap-y-4">
        <TextField
          name="email"
          type="email"
          isRequired
          label="Email"
          placeholder="Deine Email-Adresse aus der Tipprunde"
        />
        <Button type="submit" variant="primary">
          Login-Code anfordern
        </Button>
      </Form>
    </div>
  );
}
