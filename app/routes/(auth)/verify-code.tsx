import type { Route } from './+types/verify-code';

import { useSubmit } from 'react-router';

import { Button } from '~/components/ui/button';
import { Form } from '~/components/ui/form';
import { OtpField } from '~/components/ui/otp-field';
import {
  ensureOnboardingSession,
  verifyOnboardingCode,
} from '~/utils/auth.server';

export function meta() {
  return [
    { title: 'Login - runde.tips' },
    {
      name: 'description',
      value: 'Einmalpasswort-Eingabe für die Anmeldung zur Haus23 Tipprunde',
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  await ensureOnboardingSession(request);
  if (new URL(request.url).searchParams.has('code')) {
    return await verifyOnboardingCode(request);
  }
}

export async function action({ request }: Route.ActionArgs) {
  return await verifyOnboardingCode(request);
}

export default function VerifyCode({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submit(e.currentTarget);
  };

  return (
    <div className="mx-auto mt-12 flex max-w-md flex-col gap-y-6 rounded-md border p-4 shadow-md">
      <h1 className="font-medium text-2xl">Log In Code</h1>
      <Form
        method="post"
        onSubmit={onSubmit}
        validationErrors={actionData?.errors || loaderData?.errors}
        className="flex flex-col gap-y-4"
      >
        <OtpField name="code" maxLength={6} minLength={6} isRequired />
        <Button type="submit" variant="primary">
          Login-Code prüfen
        </Button>
      </Form>
    </div>
  );
}
