import { useSubmit } from "react-router";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";

import type { Route } from "./+types/login";
import { Form } from "~/components/ui/form";
import { TextField } from "~/components/ui/text-field";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { FieldError } from "~/components/ui/field-error";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  console.log(Object.fromEntries(formData));
}

export default function LoginRoute() {
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
      >
        <TextField type="email" name="email" isRequired>
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
