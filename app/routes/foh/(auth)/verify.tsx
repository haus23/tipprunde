import { useSubmit } from "react-router";
import { Button } from "~/components/ui/button";
import { CodeInput } from "~/components/ui/code-input";
import { Form } from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { TextField } from "~/components/ui/text-field";
import { FieldError } from "~/components/ui/field-error";
import { ensureOnboardingSession, verifyOnboarding } from "~/lib/auth/auth.server";

import type { Route } from "./+types/verify";
import { useRef } from "react";

export async function loader({ request }: Route.LoaderArgs) {
  return await ensureOnboardingSession(request);
}

export async function action({ request }: Route.ActionArgs) {
  return await verifyOnboarding(request);
}

export default function VerifyRoute({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  const submit = useSubmit();
  const form = useRef<HTMLFormElement>(null);

  return (
    <div className="flex flex-col gap-4">
      <title>Einlass - runde.tips</title>
      <meta name="description" content="Einlass bei der Haus23 Tipprunde" />
      <h1 className="text-2xl font-medium">Einlass</h1>
      <p className="text-sm">
        Gib den Code ein, den wir an <strong>{loaderData.identifier}</strong>{" "}
        gesendet haben.
      </p>
      <Form
        method="post"
        onSubmit={(e) => {
          e.preventDefault();
          submit(e.currentTarget);
        }}
        validationErrors={actionData?.errors}
        ref={form}
      >
        <TextField maxLength={6} name="code" isRequired autoFocus>
          <Label>Code</Label>
          <CodeInput onComplete={() => form.current?.requestSubmit()} />
          <FieldError />
        </TextField>
        <div>
          <Button type="submit" variant="primary">
            Code prüfen
          </Button>
        </div>
      </Form>
    </div>
  );
}
