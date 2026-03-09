"use client";
import { useActionState } from "react";
import { Button } from "@/components/(ui)/button";
import { Checkbox } from "@/components/(ui)/checkbox";
import { Form } from "@/components/(ui)/form";
import { FieldError, Input, Label, TextField } from "@/components/(ui)/text-field";
import { requestCode, verifyCode } from "@/lib/auth/actions";

export function LoginForm() {
  const [requestState, requestAction, requestPending] = useActionState(requestCode, null);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyCode, null);

  if (requestState?.success && !verifyState?.fatal) {
    return (
      <Form action={verifyAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={requestState.email} />
        <TextField name="code" isRequired pattern="[0-9]{6}" className="flex flex-col gap-1">
          <Label>Code</Label>
          <Input placeholder="123456" inputMode="numeric" maxLength={6} autoComplete="one-time-code" />
          <FieldError>
            {({ validationDetails }) =>
              validationDetails.patternMismatch ? "Bitte genau 6 Ziffern eingeben." : "Pflichtfeld."
            }
          </FieldError>
        </TextField>
        <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
        {verifyState?.error && <p className="text-subtle text-sm">{verifyState.error}</p>}
        <div className="flex flex-col gap-2">
          <Button type="submit" isDisabled={verifyPending}>
            Einloggen
          </Button>
          <Button variant="secondary" type="button" onPress={() => window.location.reload()}>
            Andere E-Mail verwenden
          </Button>
        </div>
      </Form>
    );
  }

  const prefillEmail = verifyState?.fatal && requestState?.success ? requestState.email : undefined;

  return (
    <Form action={requestAction} className="flex flex-col gap-4">
      <TextField type="email" name="email" isRequired defaultValue={prefillEmail} className="flex flex-col gap-1">
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
      {verifyState?.error && <p className="text-subtle text-sm">{verifyState.error}</p>}
      {requestState?.success === false && <p className="text-subtle text-sm">{requestState.error}</p>}
      <Button type="submit" isDisabled={requestPending}>
        Code anfordern
      </Button>
    </Form>
  );
}
