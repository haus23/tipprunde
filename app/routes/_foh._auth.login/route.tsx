import { redirect } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";

import type { Route } from "./+types/route";
import { prepareOnboarding } from "~/utils/auth.server";
import { userContext } from "~/utils/user.server";
import { Form } from "~/components/ui/form";
import { useSubmit } from "react-router";
import { FieldError } from "~/components/ui/field-error";
import { Checkbox } from "~/components/ui/checkbox";

export const middleware: Route.MiddlewareFunction[] = [
  async ({ context }) => {
    const user = context.get(userContext);
    if (user) throw redirect("/");
  },
];

export async function loader() {
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  return await prepareOnboarding(request);
}

export default function LoginRoute({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(e.currentTarget);
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      <title>Anmeldung - runde.tips</title>
      <meta name="description" content="Anmeldung bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Anmeldung</h1>
      <div>
        <Form
          onSubmit={onSubmit}
          validationErrors={actionData?.errors}
          method="post"
          className="flex flex-col gap-4"
        >
          <TextField type="email" name="email" isRequired>
            <Label>Email</Label>
            <Input />
            <FieldError />
          </TextField>
          <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
          <div>
            <Button type="submit">Code anfordern</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
