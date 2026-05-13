import { SESSION_DURATION_REMEMBER, TOTP_EXPIRES_IN } from "$env/static/private";
import { createSession, findUser } from "$lib/server/db/auth";
import { createTotpCode, verifyTotpCode } from "$lib/server/totp";
import { redirect } from "@sveltejs/kit";

import type { Actions, PageServerLoad } from "./$types";

type StepResult = { step: "email" | "totp"; error?: string; email?: string; rememberMe?: boolean };

export const load: PageServerLoad = async ({ cookies, locals }) => {
  if (locals.user) {
    redirect(302, "/");
  }

  const email = cookies.get("__pending_auth");

  // Continue ongoing auth flow
  if (email && (await findUser(email))) {
    return { step: "totp", email };
  }

  return { step: "email" };
};

export const actions = {
  startOver: async ({ cookies }) => {
    cookies.delete("__pending_auth", { path: "/" });
    redirect(303, "/login");
  },

  requestCode: async ({ cookies, request }): Promise<StepResult> => {
    const data = await request.formData();

    const email = data.get("email");
    if (!(typeof email === "string") || !email) {
      return { step: "email", error: "Ohne Email-Adresse klappt das nicht." };
    }

    const user = await findUser(email);
    if (!user) {
      return { step: "email", error: "Unbekannte E-Mail Adresse. Frag Micha!", email };
    }

    const code = await createTotpCode(user.id);
    console.log(code);

    cookies.set("__pending_auth", email, {
      path: "/",
      sameSite: "strict",
      maxAge: Number(TOTP_EXPIRES_IN) + 5 * 60, // UX: different errors for expired code or expired pending auth
    });

    return { step: "totp", email };
  },
  verifyCode: async ({ cookies, request }): Promise<StepResult> => {
    const data = await request.formData();

    // Validate pending auth session
    const email = cookies.get("__pending_auth");

    if (!email) {
      return { step: "email", error: "Keine oder abgelaufene Anmeldung!" };
    }

    const user = await findUser(email);

    // Early exit for hijacked cookie with invalid email
    if (!user) {
      cookies.delete("__pending_auth", { path: "/" });
      redirect(303, "/");
    }

    // Extract form data
    const code = data.get("code");
    if (!(typeof code === "string") || !code) {
      return { step: "totp", error: "Ohne Code klappt das nicht." };
    }
    const rememberMe = data.get("rememberMe") === "on";

    const result = await verifyTotpCode(user.id, code);

    // Delete pending auth if done or not recoverable
    if (result !== "invalid") {
      cookies.delete("__pending_auth", { path: "/" });
    }

    // Login user
    if (result === "valid") {
      const sessionId = await createSession(user.id, rememberMe);
      cookies.set("__auth", sessionId, {
        path: "/",
        sameSite: "strict",
        ...(rememberMe && {
          maxAge: Number(SESSION_DURATION_REMEMBER),
        }),
      });
    }

    // Exit for successful login or fatal errors
    if (result === "valid" || result === "error") {
      redirect(303, "/");
    }

    // Handle normal code errors
    const error =
      result === "expired"
        ? "Der Code ist abgelaufen. Bitte fordere einen neuen an."
        : result === "max_attempts"
          ? "Zu viele Fehlversuche. Bitte fordere einen neuen Code an."
          : "Ungültiger Code. Bitte versuche es erneut.";
    const step = result === "expired" || result === "max_attempts" ? "email" : "totp";

    return { step, email, rememberMe, error };
  },
} satisfies Actions;
