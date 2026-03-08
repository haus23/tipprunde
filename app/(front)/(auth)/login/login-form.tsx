"use client";
import { useActionState } from "react";
import { Button } from "@/components/(ui)/button";
import { Checkbox } from "@/components/(ui)/checkbox";
import { Form } from "@/components/(ui)/form";
import { Input, Label, TextField } from "@/components/(ui)/text-field";
import { requestCode, verifyCode } from "@/lib/auth/actions";

export function LoginForm() {
  const [requestState, requestAction, requestPending] = useActionState(requestCode, null);
  const [verifyState, verifyAction, verifyPending] = useActionState(verifyCode, null);

  if (requestState?.success) {
    return (
      <Form action={verifyAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={requestState.email} />
        <TextField name="code" isRequired className="flex flex-col gap-1">
          <Label>Code</Label>
          <Input placeholder="123456" autoComplete="one-time-code" />
        </TextField>
        <Checkbox name="rememberMe">Angemeldet bleiben</Checkbox>
        {verifyState?.error && (
          <p className="text-sm text-subtle">{verifyState.error}</p>
        )}
        <div className="flex flex-col gap-2">
          <Button type="submit" isDisabled={verifyPending}>
            Einloggen
          </Button>
          <Button type="button" onPress={() => window.location.reload()}>
            Andere E-Mail verwenden
          </Button>
        </div>
      </Form>
    );
  }

  return (
    <Form action={requestAction} className="flex flex-col gap-4">
      <TextField type="email" name="email" isRequired className="flex flex-col gap-1">
        <Label>E-Mail</Label>
        <Input placeholder="deine@email.de" autoComplete="email" />
      </TextField>
      {requestState?.error && (
        <p className="text-sm text-subtle">{requestState.error}</p>
      )}
      <Button type="submit" isDisabled={requestPending}>
        Code anfordern
      </Button>
    </Form>
  );
}
