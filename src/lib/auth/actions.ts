import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { SESSION_DURATION_REMEMBER } from "@/lib/auth/config.ts";
import {
  createDbSession,
  createTotpCode,
  getUserByEmail,
  sendTotpEmail,
  verifyTotpCode,
} from "@/lib/auth/functions.server.ts";
import { updateAppSession } from "@/lib/auth/session.ts";
import { validateForm } from "@/lib/validate-form.ts";

const requestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

type RequestState =
  | { success: true; email: string }
  | { success: false; email: string; error: string };

export const requestCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(requestSchema))
  .handler(async ({ data }): Promise<RequestState> => {
    if (!data.success) {
      return {
        success: false,
        email: String(data.issues[0].input),
        error: "Ungültige E-Mail Adresse",
      };
    }

    const { email } = data.output;
    const user = await getUserByEmail(email);

    if (!user) {
      return { success: false, email, error: "Unbekannte E-Mail Adresse. Frag Micha!" };
    }

    const code = await createTotpCode(user.id);

    try {
      await sendTotpEmail(email, code);
    } catch {
      return {
        success: false,
        email,
        error: "E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.",
      };
    }

    return { success: true, email };
  });

const verifySchema = v.object({
  email: v.pipe(v.string(), v.email()),
  code: v.pipe(v.string(), v.length(6)),
  rememberMe: v.pipe(
    v.optional(v.string()),
    v.transform((input) => input === "on"),
  ),
});

export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(verifySchema))
  .handler(async ({ data }) => {
    if (!data.success) {
      return {
        error: "Ungültige Anfrage",
      };
    }
    const { email, code, rememberMe } = data.output;

    const user = await getUserByEmail(email);

    if (!user) {
      return { error: "Ungültige Anfrage." };
    }

    const result = await verifyTotpCode(user.id, code);

    if (result === "expired") {
      return { error: "Der Code ist abgelaufen. Bitte fordere einen neuen an.", fatal: true };
    }

    if (result === "max_attempts") {
      return { error: "Zu viele Fehlversuche. Bitte fordere einen neuen Code an.", fatal: true };
    }

    if (result === "invalid") {
      return { error: "Falscher Code. Bitte versuche es erneut." };
    }

    const sessionId = await createDbSession(user.id, !!rememberMe);
    await updateAppSession(
      { sessionId, role: user.role },
      rememberMe && { maxAge: SESSION_DURATION_REMEMBER },
    );

    return { success: true };
  });
