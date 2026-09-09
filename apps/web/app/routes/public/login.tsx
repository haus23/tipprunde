import { Button, Checkbox, TextField } from "@tipprunde/ui";
import { ArrowLeftIcon } from "lucide-react";
import { data, Form, redirect, useNavigation } from "react-router";
import * as v from "valibot";

import { logAuthEvent } from "#/lib/auth-events.server.ts";
import { userContext } from "#/lib/context.ts";
import {
  commitSession,
  createSession,
  getSessionFromRequest,
  sessionCookieMaxAge,
} from "#/lib/session.server.ts";

import type { Route } from "./+types/login";
import {
  createLoginCode,
  findUserByEmail,
  sendLoginCodeEmail,
  verifyLoginCode,
} from "./_auth.server.ts";

const emailSchema = v.pipe(v.string(), v.trim(), v.email());
const codeSchema = v.pipe(v.string(), v.trim(), v.regex(/^\d{6}$/));

/** Only ever redirect to a path on this origin. */
function safeRedirectTo(raw: FormDataEntryValue | string | null): string {
  const value = typeof raw === "string" ? raw : "";
  return value.startsWith("/") && !value.startsWith("//") ? value : "/";
}

/** `email` echoes the attempted address back so the field isn't cleared. */
type LoginError = { error: string; email?: string };

type LoginSession = Awaited<ReturnType<typeof getSessionFromRequest>>;

/** Stays on the step the user is on. */
function fail(error: LoginError, init?: ResponseInit) {
  return data<LoginError>(error, { status: 400, ...init });
}

/**
 * Sends the user back to the address step, having dropped the pending login.
 *
 * **200, not 400, on purpose.** React Router skips loader revalidation when an
 * action answers 400 or above (`shouldSkipRevalidation` in the router), so
 * `fail()` here cleared `pendingEmail` in the cookie and still left the code
 * form standing — a form whose session no longer existed, which answered the
 * next submit with a second and more confusing message. Nothing failed about
 * this response in any case: the request was handled, and the answer is "start
 * over".
 *
 * `email` comes back only where the person at the keyboard cannot have changed
 * since they typed it. See the call sites.
 */
async function restart(session: LoginSession, error: string, email?: string) {
  session.unset("pendingEmail");
  return data<LoginError>(
    { error, email },
    { headers: { "Set-Cookie": await commitSession(session) } },
  );
}

export async function loader({ request, url, context }: Route.LoaderArgs) {
  const redirectTo = safeRedirectTo(url.searchParams.get("redirectTo"));

  // Already signed in — nothing to do here.
  if (context.get(userContext)) throw redirect(redirectTo);

  const session = await getSessionFromRequest(request);
  const pendingEmail = session.get("pendingEmail");

  return { step: pendingEmail ? ("code" as const) : ("email" as const), email: pendingEmail ?? "" };
}

export async function action({ request, url }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  // Forms post to the current URL, so the query survives the round trip.
  const redirectTo = safeRedirectTo(url.searchParams.get("redirectTo"));
  const session = await getSessionFromRequest(request);

  if (intent === "start-over") {
    session.unset("pendingEmail");
    return data(null, { headers: { "Set-Cookie": await commitSession(session) } });
  }

  if (intent === "request-code") {
    const parsed = v.safeParse(emailSchema, formData.get("email"));
    if (!parsed.success) {
      return fail({ error: "Ohne gültige Email-Adresse klappt das nicht." });
    }
    const email = parsed.output;

    const user = await findUserByEmail(email);
    if (!user) {
      await logAuthEvent({ type: "unknown_email", email });
      return fail({ error: "Unbekannte E-Mail Adresse. Frag Micha!", email });
    }

    // Kept separate: a failure in here used to be reported as "mail could not
    // be sent", which sent debugging down the wrong path when the real cause
    // was a missing APP_SECRET.
    let code: string;
    try {
      code = await createLoginCode(user.id);
    } catch (err) {
      console.error("[auth] createLoginCode failed:", err);
      await logAuthEvent({
        type: "request_failed",
        userId: user.id,
        email,
        detail: `Code konnte nicht erzeugt werden: ${err instanceof Error ? err.message : String(err)}`,
      });
      return fail(
        { error: "Anmeldung gerade nicht möglich. Bitte versuche es später erneut.", email },
        { status: 500 },
      );
    }

    try {
      await sendLoginCodeEmail(email, code);
    } catch (err) {
      console.error("[auth] sendLoginCodeEmail failed:", err);
      await logAuthEvent({
        type: "request_failed",
        userId: user.id,
        email,
        detail: `Code konnte nicht gesendet werden: ${err instanceof Error ? err.message : String(err)}`,
      });
      return fail(
        { error: "Code konnte nicht gesendet werden. Bitte versuche es erneut.", email },
        { status: 502 },
      );
    }

    await logAuthEvent({ type: "code_requested", userId: user.id, email });

    session.set("pendingEmail", email);
    return data(null, { headers: { "Set-Cookie": await commitSession(session) } });
  }

  if (intent === "verify-code") {
    const email = session.get("pendingEmail");
    if (!email) return restart(session, "Keine oder abgelaufene Anmeldung!");

    const user = await findUserByEmail(email);
    // Hijacked/stale cookie pointing at no real user — bail out cleanly.
    if (!user) return restart(session, "Bitte melde dich erneut an.");

    const rememberMe = formData.get("rememberMe") != null;
    const parsed = v.safeParse(codeSchema, formData.get("code"));
    if (!parsed.success) return fail({ error: "Ein Code hat sechs Ziffern." });

    const result = await verifyLoginCode(user.id, parsed.output);

    if (result === "valid") {
      await logAuthEvent({ type: "login_succeeded", userId: user.id, email });
      const sessionId = await createSession(user.id, rememberMe);
      session.unset("pendingEmail");
      session.set("sessionId", sessionId);
      return redirect(redirectTo, {
        headers: {
          "Set-Cookie": await commitSession(session, { maxAge: sessionCookieMaxAge(rememberMe) }),
        },
      });
    }

    if (result === "invalid" || result === "expired" || result === "max_attempts") {
      await logAuthEvent({
        type:
          result === "invalid"
            ? "code_invalid"
            : result === "expired"
              ? "code_expired"
              : "code_max_attempts",
        userId: user.id,
        email,
      });
    }

    // Only an invalid code leaves the user on the code step to retry; the
    // others have no usable code left, so send them back to step one.
    if (result === "invalid") return fail({ error: "Ungültiger Code." });

    // The address only travels back from the failed attempts: seconds have
    // passed in one sitting, somebody is at the keyboard, and the address is
    // already on their screen. An expired code means ten minutes or more went
    // by — exactly long enough for the person at the machine to be someone
    // else, and putting the address back would hand it to them rather than
    // remind its owner of it.
    if (result === "max_attempts") {
      return restart(session, "Zu viele Fehlversuche. Bitte fordere einen neuen Code an.", email);
    }

    return restart(
      session,
      result === "expired"
        ? "Der Code ist abgelaufen. Bitte fordere einen neuen an."
        : "Etwas ist schiefgelaufen. Bitte versuche es erneut.",
    );
  }

  return fail({ error: "Unbekannte Aktion." });
}

export default function Login({ loaderData, actionData }: Route.ComponentProps) {
  const { step, email } = loaderData;
  const navigation = useNavigation();
  const pending = navigation.state !== "idle";
  const submittingIntent = navigation.formData?.get("intent");
  // Only the email-step failures echo the attempted address back.
  const attemptedEmail = actionData?.email;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-4 py-12">
      <title>Anmelden · runde.tips</title>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Anmelden</h1>
        <p className="text-subtle mt-1 text-base">
          {step === "email"
            ? "Melde dich mit deiner E-Mail-Adresse an."
            : `Wir haben einen Code an ${email} gesendet.`}
        </p>
      </div>

      <div className="border-subtle bg-surface-raised shadow-popover rounded-md border p-6">
        {step === "email" ? (
          <Form method="post" className="flex flex-col gap-4">
            <input type="hidden" name="intent" value="request-code" />
            <TextField
              name="email"
              type="email"
              isRequired
              defaultValue={attemptedEmail ?? ""}
              autoComplete="email"
              autoFocus
              label="E-Mail"
            />

            {actionData?.error && <p className="text-error text-base">{actionData.error}</p>}

            <Button type="submit" isDisabled={pending} className="mt-1">
              {pending ? "Sende Code …" : "Code anfordern"}
            </Button>
          </Form>
        ) : (
          <div className="flex flex-col gap-4">
            <Form method="post" className="flex flex-col gap-4">
              <input type="hidden" name="intent" value="verify-code" />
              <TextField
                name="code"
                isRequired
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

              <Checkbox name="rememberMe" className="text-base">
                Angemeldet bleiben
              </Checkbox>

              {actionData?.error && <p className="text-error text-base">{actionData.error}</p>}

              <Button type="submit" isDisabled={pending} className="mt-1">
                {pending && submittingIntent === "verify-code" ? "Prüfe Code …" : "Anmelden"}
              </Button>
            </Form>

            <Form method="post" className="flex justify-center">
              <input type="hidden" name="intent" value="start-over" />
              <Button type="submit" intent="ghost" size="sm" isDisabled={pending}>
                <ArrowLeftIcon className="size-4" />
                Andere E-Mail
              </Button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
}
