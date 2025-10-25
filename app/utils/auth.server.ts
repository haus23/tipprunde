import { env } from "./env.server";
import { getUserByEmail } from "./db/users";
import { redirect } from "react-router";
import { createLoginCode, verifyLoginCode } from "./totp.server";
import { createSession, deleteSession } from "./db/sessions";
import {
  commitAuthSession,
  destroyAuthSession,
  getAuthSession,
} from "./sessions.server";
import { sendCodeMail } from "./emails.server";

// Auth Flow Helpers
//

/**
 * Prepares users onboarding. Expects email in request form data.
 *
 * If no valid email address is in the form data, it returns an error.
 * Otherwise, it creates an onboarding code and redirects to the onboarding page
 * to let the user enter the mailed code.
 *
 * @param request - Request object
 */
export async function prepareOnboarding(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email")).trim();
  const rememberMe = String(formData.get("rememberMe")) === "on";

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      errors: { email: "Unbekannte Email-Adresse. Wende dich an Micha." },
    };
  }

  const code = await createLoginCode(email);
  await sendCodeMail({ email, name: user.name, code });

  const session = await getAuthSession(request);
  session.flash("email", email);
  session.flash("rememberMe", rememberMe);

  throw redirect("/verify" + new URL(request.url).search, {
    headers: {
      "Set-Cookie": await commitAuthSession(session),
    },
  });
}

/**
 * Ensures that there is an ongoing onboarding session.
 *
 * @param request Request object
 */
export async function ensureOnboardingSession(request: Request) {
  const session = await getAuthSession(request);
  const email = session.get("email");

  if (!email) {
    throw redirect("/login");
  }
}

/**
 * Performs user login
 *
 * Expects valid email in session and totp code in request.
 * Returns error for invalid data. Logs the user in and redirects to home otherwise.
 *
 * @param request Request object
 * @returns Login errors or redirects
 */
export async function verifyOnboardingCode(request: Request) {
  const session = await getAuthSession(request);
  const email = session.get("email");
  const rememberMe = session.get("rememberMe");

  if (!email) {
    throw redirect("/login");
  }

  const user = await getUserByEmail(email);
  if (!user) throw Error("Netter Versuch!");

  const formData = await request.formData();
  const code = String(formData.get("code"));

  if (!code) {
    return {
      errors: { code: "Du musst Deinen Code eingeben, um fortzufahren." },
    };
  } else if (code.length !== 6) {
    return {
      errors: {
        code: `Ein Code hat sechs Zeichen. Du hast nur ${code.length} eingegeben.`,
      },
    };
  }

  // Verify code
  const verifyResult = await verifyLoginCode(email, code);
  if (!verifyResult.success) {
    if (!verifyResult.retry) {
      throw redirect("/login", {
        headers: {
          "Set-Cookie": await commitAuthSession(session),
        },
      });
    }
    return { errors: { code: verifyResult.error } };
  }

  // Create the app session
  const expires = rememberMe
    ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 365) // One year
    : new Date(Date.now() + env.SESSION_DURATION * 1000);
  const { id: sessionId } = await createSession(user.id, expires);

  session.set("sessionId", sessionId);

  const searchParams = new URL(request.url).searchParams;
  const redirectUrl = searchParams.get("redirectTo") ?? "/";

  throw redirect(decodeURIComponent(redirectUrl), {
    headers: {
      "Set-Cookie": await commitAuthSession(
        session,
        rememberMe ? { expires } : undefined,
      ),
    },
  });
}

/**
 * Performs user logout and redirects to referer or home if no referer is available.
 *
 * @param request Request object
 */
export async function logout(request: Request) {
  const session = await getAuthSession(request);
  const sessionId = session.get("sessionId");

  if (sessionId) {
    await deleteSession(sessionId);
  }

  const headers = new Headers({
    "Set-Cookie": await destroyAuthSession(session),
  });

  const redirectUrl = request.headers.get("Referer") || "/";
  throw redirect(redirectUrl, { headers });
}
