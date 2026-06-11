import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Button } from "@tipprunde/ui";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { useState, useTransition } from "react";
import {
  CheckboxButton,
  CheckboxField,
  FieldError,
  Form,
  Input,
  Label,
  TextField,
} from "react-aria-components";

import { getPendingLogin, requestCode, startOver, verifyCode } from "#/lib/auth.ts";
import type { LoginStep } from "#/lib/auth.ts";

export const Route = createFileRoute("/login")({
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/" });
    }
  },
  loader: () => getPendingLogin(),
  component: RouteComponent,
});

const fieldClasses = "flex flex-col gap-1.5";
const labelClasses = "text-app text-sm font-medium";
const inputClasses =
  "border-subtle bg-surface text-app focus-visible:ring-accent rounded-sm border px-3 py-2 text-sm outline-none transition ease-out focus-visible:ring-2";

function RouteComponent() {
  const router = useRouter();
  const initial = Route.useLoaderData();

  const [state, setState] = useState<LoginStep>(initial);
  const [email, setEmail] = useState(initial.email ?? "");
  const [code, setCode] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [pending, startTransition] = useTransition();

  function submitEmail(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await requestCode({ data: { email } });
      setCode("");
      setState(result);
    });
  }

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await verifyCode({ data: { code, rememberMe } });
      if (result.done) {
        // Cookie is set on the response; refresh session context, then leave /login.
        await router.invalidate();
        await router.navigate({ to: "/" });
        return;
      }
      setState(result);
    });
  }

  function changeEmail() {
    startTransition(async () => {
      await startOver();
      setCode("");
      setState({ step: "email", email });
    });
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-4 py-12">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Anmelden</h1>
        <p className="text-subtle mt-1 text-sm">
          {state.step === "email"
            ? "Melde dich mit deiner E-Mail-Adresse an."
            : `Wir haben einen Code an ${state.email} gesendet.`}
        </p>
      </div>

      <div className="border-subtle bg-surface-raised shadow-popover rounded-md border p-6">
        {state.step === "email" ? (
          <Form onSubmit={submitEmail} className="flex flex-col gap-4">
            <TextField name="email" type="email" isRequired className={fieldClasses}>
              <Label className={labelClasses}>E-Mail</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
                className={inputClasses}
              />
              <FieldError className="text-error text-sm" />
            </TextField>

            {state.error && <p className="text-error text-sm">{state.error}</p>}

            <Button type="submit" isDisabled={pending} className="mt-1">
              {pending ? "Sende Code …" : "Code anfordern"}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={submitCode} className="flex flex-col gap-4">
            <TextField name="code" isRequired className={fieldClasses}>
              <Label className={labelClasses}>Login-Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                autoFocus
                className={`${inputClasses} text-center text-lg tracking-[0.5em]`}
              />
              <FieldError className="text-error text-sm" />
            </TextField>

            <CheckboxField
              isSelected={rememberMe}
              onChange={setRememberMe}
              className="flex items-center gap-2 text-sm"
            >
              <CheckboxButton className="group border-subtle data-selected:border-accent data-selected:bg-accent data-focused:ring-accent flex size-5 items-center justify-center rounded border transition ease-out outline-none data-focused:ring-2">
                <CheckIcon className="group-data-selected:text-accent-fg size-3 stroke-[3] text-transparent" />
              </CheckboxButton>
              <Label className="text-app select-none">Angemeldet bleiben</Label>
            </CheckboxField>

            {state.error && <p className="text-error text-sm">{state.error}</p>}

            <Button type="submit" isDisabled={pending} className="mt-1">
              {pending ? "Prüfe Code …" : "Anmelden"}
            </Button>

            <Button
              type="button"
              intent="ghost"
              size="sm"
              isDisabled={pending}
              onPress={changeEmail}
              className="self-center"
            >
              <ArrowLeftIcon className="size-4" />
              Andere E-Mail
            </Button>
          </Form>
        )}
      </div>
    </div>
  );
}
