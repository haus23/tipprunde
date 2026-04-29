"use client";

import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { requestCode, verifyCode } from "#/app/(auth)/login.ts";
import { Button } from "#/components/(ui)/button.tsx";
import { Checkbox } from "#/components/(ui)/checkbox.tsx";
import { Form } from "#/components/(ui)/form.tsx";
import { FieldError, Input, Label, TextField } from "#/components/(ui)/text-field.tsx";
import { useServerAction } from "#/utils/hooks/server-action.ts";

export function LoginForm() {
  const navigate = useNavigate();
  const [requestState, requestCodeAction, requestPending] = useServerAction(requestCode);
  const [verifyState, verifyCodeAction, verifyPending] = useServerAction(verifyCode);

  const [step, setStep] = useState<"email" | "code">("email");

  useEffect(() => {
    if (requestState?.success) setStep("code");
  }, [requestState]);

  useEffect(() => {
    if (verifyState?.success) {
      void navigate({ to: "/manager" });
    } else if (verifyState?.fatal) setStep("email");
  }, [verifyState]);

  if (step === "code" && requestState?.success) {
    return (
      <Form
        validationErrors={verifyState?.errors ?? {}}
        action={verifyCodeAction}
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="email" value={requestState.values.email} />
        <TextField name="code" isRequired pattern="[0-9]{6}" className="flex flex-col gap-1">
          <Label>Code</Label>
          <Input
            placeholder="123456"
            inputMode="numeric"
            maxLength={6}
            autoComplete="one-time-code"
          />
          <FieldError>
            {({ validationDetails, validationErrors }) =>
              validationDetails.patternMismatch
                ? "Bitte genau 6 Ziffern eingeben."
                : validationDetails.valueMissing
                  ? "Pflichtfeld."
                  : validationErrors.at(0)
            }
          </FieldError>
        </TextField>
        <Checkbox name="rememberMe" defaultSelected={verifyState?.values?.rememberMe === "on"}>
          Angemeldet bleiben
        </Checkbox>
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
    <Form
      validationErrors={requestState?.errors ?? {}}
      action={requestCodeAction}
      className="flex flex-col gap-4"
    >
      <TextField
        type="email"
        name="email"
        isRequired
        defaultValue={requestState?.values?.email ?? ""}
        className="flex flex-col gap-1"
      >
        <Label>E-Mail</Label>
        <Input placeholder="deine@email.de" autoComplete="email" />
        <FieldError>
          {({ validationDetails, validationErrors }) =>
            validationDetails.valueMissing
              ? "Ohne E-Mail-Adresse geht das nicht ;-)"
              : validationDetails.typeMismatch
                ? "Ungültige E-Mail Adresse"
                : validationErrors.at(0)
          }
        </FieldError>
      </TextField>
      {verifyState?.fatal && (
        <p className="text-error -translate-y-2 text-sm">{verifyState.errors.email[0]}</p>
      )}
      <Button type="submit" isDisabled={requestPending}>
        Code anfordern
      </Button>
    </Form>
  );
}
