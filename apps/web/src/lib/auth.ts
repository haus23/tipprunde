import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

import {
  createLoginCode,
  createSession,
  deleteSession,
  findUserByEmail,
  sendLoginCodeEmail,
  verifyLoginCode,
} from "./auth.server.ts";

const PENDING_COOKIE = "__pending_auth";
const PENDING_MAX_AGE = Number(process.env["TOTP_EXPIRES_IN"]) + 5 * 60; // code lifetime + UX grace
const SESSION_DURATION_REMEMBER = Number(process.env["SESSION_DURATION_REMEMBER"]);

const emailSchema = v.pipe(v.string(), v.trim(), v.email());
const codeSchema = v.pipe(v.string(), v.trim(), v.regex(/^\d{6}$/));

export type LoginStep = {
  step: "email" | "totp";
  email?: string;
  rememberMe?: boolean;
  error?: string;
  /** Set on a successful login — the client navigates away (server fns can't throw redirect here). */
  done?: boolean;
};

/** Loader: resume an in-progress code entry if the pending cookie is still valid. */
export const getPendingLogin = createServerFn().handler(async (): Promise<LoginStep> => {
  const email = getCookie(PENDING_COOKIE);
  if (email && (await findUserByEmail(email))) {
    return { step: "totp", email };
  }
  return { step: "email" };
});

/** Step 1: validate email, send a one-time code, remember the email in a cookie. */
export const requestCode = createServerFn({ method: "POST" })
  .validator((data: { email: string }) => data)
  .handler(async ({ data }): Promise<LoginStep> => {
    const parsed = v.safeParse(emailSchema, data.email);
    if (!parsed.success) {
      return {
        step: "email",
        email: data.email,
        error: "Ohne gültige Email-Adresse klappt das nicht.",
      };
    }
    const email = parsed.output;

    const user = await findUserByEmail(email);
    if (!user) {
      return { step: "email", email, error: "Unbekannte E-Mail Adresse. Frag Micha!" };
    }

    try {
      const code = await createLoginCode(user.id);
      await sendLoginCodeEmail(email, code);
    } catch {
      return {
        step: "email",
        email,
        error: "Code konnte nicht gesendet werden. Bitte versuche es erneut.",
      };
    }

    setCookie(PENDING_COOKIE, email, { path: "/", sameSite: "strict", maxAge: PENDING_MAX_AGE });
    return { step: "totp", email };
  });

/** Step 2: validate the code, create a session, log the user in. */
export const verifyCode = createServerFn({ method: "POST" })
  .validator((data: { code: string; rememberMe: boolean }) => data)
  .handler(async ({ data }): Promise<LoginStep> => {
    const email = getCookie(PENDING_COOKIE);
    if (!email) {
      return { step: "email", error: "Keine oder abgelaufene Anmeldung!" };
    }

    const user = await findUserByEmail(email);
    // Hijacked/stale cookie pointing at no real user — bail out cleanly.
    if (!user) {
      deleteCookie(PENDING_COOKIE);
      return { step: "email", error: "Bitte melde dich erneut an." };
    }

    const parsed = v.safeParse(codeSchema, data.code);
    if (!parsed.success) {
      return { step: "totp", rememberMe: data.rememberMe, error: "Ein Code hat sechs Ziffern." };
    }

    const result = await verifyLoginCode(user.id, parsed.output);

    // Keep pending auth only when the user may retry the same code.
    if (result !== "invalid") {
      deleteCookie(PENDING_COOKIE);
    }

    if (result === "valid") {
      const sessionId = await createSession(user.id, data.rememberMe);
      setCookie("__auth", sessionId, {
        path: "/",
        sameSite: "strict",
        ...(data.rememberMe && { maxAge: SESSION_DURATION_REMEMBER }),
      });
      return { step: "totp", done: true };
    }

    if (result === "error") {
      return { step: "email", error: "Etwas ist schiefgelaufen. Bitte versuche es erneut." };
    }

    const error =
      result === "expired"
        ? "Der Code ist abgelaufen. Bitte fordere einen neuen an."
        : result === "max_attempts"
          ? "Zu viele Fehlversuche. Bitte fordere einen neuen Code an."
          : "Ungültiger Code. Bitte versuche es erneut.";
    // expired / max_attempts have no recoverable code — send the user back to step 1.
    const step = result === "expired" || result === "max_attempts" ? "email" : "totp";

    return { step, email, rememberMe: data.rememberMe, error };
  });

/** Abandon an in-progress code entry and return to the email step. */
export const startOver = createServerFn({ method: "POST" }).handler(() => {
  deleteCookie(PENDING_COOKIE);
});

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  const sessionId = getCookie("__auth");
  if (sessionId) {
    await deleteSession(sessionId);
    deleteCookie("__auth");
  }
});
