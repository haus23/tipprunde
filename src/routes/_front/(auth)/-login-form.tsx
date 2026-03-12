import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field.tsx";
import { Button } from "@/components/(ui)/button.tsx";
import { Form } from "@/components/(ui)/form.tsx";

import { requestCode, verifyCode } from "@/lib/auth/actions.ts";
import { useServerAction } from "@/lib/hooks/server-action.ts";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/(ui)/checkbox.tsx";
import { useNavigate } from "@tanstack/react-router";

export function LoginForm() {
  const navigate = useNavigate();
  const [requestState, requestCodeAction, requestPending] = useServerAction(requestCode);
  const [verifyState, verifyCodeAction, verifyPending] = useServerAction(verifyCode);

  // Two Step Form
  const [step, setStep] = useState<"email" | "code">("email");
  useEffect(() => {
    if (requestState?.success) setStep("code");
  }, [requestState]);

  useEffect(() => {
    if (verifyState?.success) {
      navigate({ to: "/manager" });
    } else if (verifyState?.fatal) setStep("email");
  }, [verifyState]);

  if (step === "code" && requestState?.success) {
    return (
      <Form action={verifyCodeAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={requestState.email} />
        <TextField name="code" isRequired pattern="[0-9]{6}" className="flex flex-col gap-1">
          <Label>Code</Label>
          <Input
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <FieldError>
            {({ validationDetails }) =>
              validationDetails.patternMismatch ? "Bitte genau 6 Ziffern eingeben." : "Pflichtfeld."
            }
          </FieldError>
        </TextField>
        <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
        {verifyState?.error && !verifyState.fatal && (
          <p className="text-subtle text-sm">{verifyState.error}</p>
        )}
        <div className="flex flex-col gap-2">
          <Button type="submit" isDisabled={verifyPending}>
            Einloggen
          </Button>
          <Button variant="secondary" type="button" onPress={() => setStep("email")}>
            Andere E-Mail verwenden
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form action={requestCodeAction} className="flex flex-col gap-4">
      <TextField
        type="email"
        name="email"
        isRequired
        defaultValue={requestState?.email || ""}
        className="flex flex-col gap-1"
      >
        <Label>E-Mail</Label>
        <Input placeholder="deine@email.de" autoComplete="email" />
        <FieldError>
          {({ validationDetails }) =>
            validationDetails.valueMissing
              ? "Pflichtfeld."
              : "Bitte eine gültige E-Mail-Adresse eingeben."
          }
        </FieldError>
      </TextField>
      {verifyState?.fatal && requestState?.success !== false && (
        <p className="text-subtle text-sm">{verifyState.error}</p>
      )}
      {requestState?.success === false && (
        <p className="text-subtle text-sm">{requestState.error}</p>
      )}
      <Button type="submit" isDisabled={requestPending}>
        Code anfordern
      </Button>
    </Form>
  );
}
