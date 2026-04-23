import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createDbSession, updateCookieSession } from "#/app/(auth)/session.server.ts";
import {
  createTotpCode,
  getUserByEmail,
  sendTotpEmail,
  verifyTotpCode,
} from "#/app/(auth)/totp.server.ts";
import { env } from "#/utils/env.server.ts";
import { validateForm } from "#/utils/validate-form.ts";

const requestSchema = v.object({
  email: v.pipe(v.string(), v.email()),
});

export const requestCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(requestSchema))
  .handler(async ({ data }) => {
    if (!data.success) {
      return {
        success: false,
        email: String(data.issues[0].input),
        errors: { email: ["Ungültige E-Mail Adresse"] },
      };
    }

    const { email } = data.output;
    const user = await getUserByEmail(email);

    if (!user) {
      return {
        success: false,
        email,
        errors: { email: ["Unbekannte E-Mail Adresse. Frag Micha!"] },
      };
    }

    const code = await createTotpCode(user.id);

    try {
      await sendTotpEmail(email, code);
    } catch {
      return {
        success: false,
        email,
        errors: { email: ["E-Mail konnte nicht gesendet werden. Bitte versuche es erneut."] },
      };
    }

    return { success: true, email };
  });

const verifySchema = v.object({
  email: v.pipe(v.string(), v.email()),
  code: v.pipe(v.string(), v.length(6)),
  rememberMe: v.optional(v.string()),
});

export const verifyCode = createServerFn({ method: "POST" })
  .inputValidator(validateForm(verifySchema))
  .handler(async ({ data }) => {
    if (!data.success) {
      return { errors: { email: [], code: ["Ungültige Anfrage"] } };
    }
    const { email, code } = data.output;
    const rememberMe = data.output.rememberMe === "on";

    const user = await getUserByEmail(email);

    if (!user) {
      return { errors: { email: [], code: ["Ungültige Anfrage"] }, rememberMe };
    }

    const result = await verifyTotpCode(user.id, code);

    if (result === "expired") {
      return {
        errors: { email: ["Der Code ist abgelaufen. Bitte fordere einen neuen an."], code: [] },
        rememberMe,
        fatal: true,
      };
    }

    if (result === "max_attempts") {
      return {
        errors: { email: ["Zu viele Fehlversuche. Bitte fordere einen neuen Code an."], code: [] },
        rememberMe,
        fatal: true,
      };
    }

    if (result === "invalid") {
      return { errors: { email: [], code: ["Falscher Code. Bitte versuche es erneut."] }, rememberMe };
    }

    const sessionId = await createDbSession(user.id, rememberMe);
    await updateCookieSession(
      { sessionId, role: user.role },
      rememberMe ? { maxAge: env.SESSION_DURATION_REMEMBER } : undefined,
    );

    return { success: true };
  });
