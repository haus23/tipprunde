import { useSubmit } from "react-router";
import { Form } from "~/components/ui/form";
import { FieldError } from "~/components/ui/field-error";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { OtpInput } from "~/components/ui/otp-input";
import { TextField } from "~/components/ui/text-field";
import {
  ensureOnboardingSession,
  verifyOnboardingCode,
} from "~/utils/auth.server";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  await ensureOnboardingSession(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await verifyOnboardingCode(request);
}

export default function VerifyRoute({ actionData }: Route.ComponentProps) {
  const submit = useSubmit();
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit(e.currentTarget);
  };

  return (
    <div className="p-2 flex flex-col gap-4">
      <title>Einlass - runde.tips</title>
      <meta name="description" content="Einlass bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Einlass</h1>
      <div>
        <Form
          onSubmit={onSubmit}
          validationErrors={actionData?.errors}
          method="post"
          className="flex flex-col items-center gap-4"
        >
          <TextField
            maxLength={6}
            name="code"
            isRequired
            className="items-center"
            autoFocus
          >
            <Label>Code</Label>
            <OtpInput />
            <FieldError />
          </TextField>
          <div>
            <Button type="submit">Code prüfen</Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
