import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { Button, Checkbox, TextField } from "@tipprunde/ui";
import { ArrowLeftIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { Form } from "react-aria-components";

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
        <p className="text-subtle mt-1">
          {state.step === "email"
            ? "Melde dich mit deiner E-Mail-Adresse an."
            : `Wir haben einen Code an ${state.email} gesendet.`}
        </p>
      </div>

      <div className="border-subtle bg-surface-raised shadow-popover rounded-md border p-6">
        {state.step === "email" ? (
          <Form onSubmit={submitEmail} className="flex flex-col gap-4">
            <TextField
              name="email"
              type="email"
              isRequired
              value={email}
              onChange={setEmail}
              autoComplete="email"
              autoFocus
              label="E-Mail"
            />

            {state.error && <p className="text-error">{state.error}</p>}

            <Button type="submit" isDisabled={pending} className="mt-1">
              {pending ? "Sende Code …" : "Code anfordern"}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={submitCode} className="flex flex-col gap-4">
            <TextField
              name="code"
              isRequired
              value={code}
              onChange={setCode}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              autoFocus
              label="Login-Code"
              inputProps={{
                placeholder: "123456",
                className: "text-center text-lg tracking-[0.5em]",
              }}
            />

            <Checkbox isSelected={rememberMe} onChange={setRememberMe}>
              Angemeldet bleiben
            </Checkbox>

            {state.error && <p className="text-error">{state.error}</p>}

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
