import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createDbSession, updateCookieSession } from "#/app/(auth)/session.server.ts";
import {
  createTotpCodeFn,
  getUserByEmailFn,
  sendTotpEmailFn,
  verifyTotpCodeFn,
} from "#/app/(auth)/totp.server.ts";
import { env } from "#/utils/env.server.ts";
import { validateForm } from "#/utils/validate-form.ts";

type FieldErrors = Record<string, string[]>;

const requestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

export const requestCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(requestSchema))
  .handler(async ({ data }) => {
    if (!data.success) {
      const email = String(data.issues[0].input);
      return {
        success: false as const,
        errors: { email: ["Ungültige E-Mail Adresse"] } satisfies FieldErrors,
        values: { email },
      };
    }

    const { email } = data.output;
    const user = await getUserByEmailFn(email);

    if (!user) {
      return {
        success: false as const,
        errors: { email: ["Unbekannte E-Mail Adresse. Frag Micha!"] } satisfies FieldErrors,
        values: { email },
      };
    }

    const code = await createTotpCodeFn(user.id);

    try {
      await sendTotpEmailFn(email, code);
    } catch {
      return {
        success: false as const,
        errors: {
          email: ["E-Mail konnte nicht gesendet werden. Bitte versuche es erneut."],
        } satisfies FieldErrors,
        values: { email },
      };
    }

    return { success: true as const, values: { email } };
  });

const verifySchema = v.object({
  email: v.pipe(v.string(), v.email()),
  code: v.pipe(v.string(), v.length(6)),
  rememberMe: v.optional(v.string()),
});

type VerifyValues = { email: string; code: string; rememberMe: string | undefined };

export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(verifySchema))
  .handler(async ({ data }) => {
    if (!data.success) {
      return {
        errors: { email: [], code: ["Ungültige Anfrage"] } satisfies FieldErrors,
        values: { email: "", code: "", rememberMe: undefined } satisfies VerifyValues,
      };
    }
    const { email, code, rememberMe } = data.output;
    const values: VerifyValues = { email, code, rememberMe };
    const remember = rememberMe === "on";

    const user = await getUserByEmailFn(email);

    if (!user) {
      return {
        errors: { email: [], code: ["Ungültige Anfrage"] } satisfies FieldErrors,
        values,
      };
    }

    const result = await verifyTotpCodeFn(user.id, code);

    if (result === "expired") {
      return {
        errors: {
          email: ["Der Code ist abgelaufen. Bitte fordere einen neuen an."],
          code: [],
        } satisfies FieldErrors,
        values,
        fatal: true as const,
      };
    }

    if (result === "max_attempts") {
      return {
        errors: {
          email: ["Zu viele Fehlversuche. Bitte fordere einen neuen Code an."],
          code: [],
        } satisfies FieldErrors,
        values,
        fatal: true as const,
      };
    }

    if (result === "invalid") {
      return {
        errors: {
          email: [],
          code: ["Falscher Code. Bitte versuche es erneut."],
        } satisfies FieldErrors,
        values,
      };
    }

    const sessionId = await createDbSession(user.id, remember);
    await updateCookieSession(
      { sessionId, role: user.role },
      remember ? { maxAge: env.SESSION_DURATION_REMEMBER } : undefined,
    );

    return { success: true as const };
  });
