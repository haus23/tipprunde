import { useSubmit } from "react-router";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form } from "~/components/ui/form";
import { TextField } from "~/components/ui/text-field";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FieldError } from "~/components/ui/field-error";

import { prepareOnboarding } from "~/lib/auth/auth.server";

import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  return await prepareOnboarding(request);
}

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();

  return (
    <div className="flex flex-col gap-4">
      <title>Anmeldung - runde.tips</title>
      <meta name="description" content="Anmeldung bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Anmeldung</h1>
      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          submit(e.currentTarget);
        }}
        validationErrors={actionData?.errors}
      >
        <TextField type="email" name="email" isRequired autoFocus>
          <Label>Email</Label>
          <Input />
          <FieldError />
        </TextField>
        <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
        <div>
          <Button type="submit" variant="primary">
            Code anfordern
          </Button>
        </div>
      </Form>
    </div>
  );
}
