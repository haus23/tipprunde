import { redirect } from "react-router";
import { getUserByEmail } from "../db/users";
import { createLoginCode, verifyLoginCode } from "~/utils/totp.server";
import { sendCodeMail, sendSecurityLogMail } from "~/utils/emails.server";
import { commitAuthSession, getAuthSession } from "./session.server";
import { createSession } from "../db/sessions";

// Auth Flow Helpers
//

/**
 * Gets prefill data for the login form from session flash.
 *
 * Used when user is redirected back to login (e.g., after failed verification).
 *
 * @param request - Request object
 * @returns Prefill data for email and rememberMe
 */
export async function getLoginPrefillData(request: Request) {
  const authSession = await getAuthSession(request);
  const prefillEmail = authSession.get("identifier");
  const prefillRememberMe = authSession.get("rememberMe");
  return { prefillEmail, prefillRememberMe };
}

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

  const user = getUserByEmail(email);

  if (!user) {
    // Send security log for invalid email attempt
    await sendSecurityLogMail(
      email,
      new Date().toLocaleString("de-DE", {
        timeZone: "Europe/Berlin",
      }),
    );
    return {
      errors: { email: "Unbekannte Email-Adresse. Wende dich an Micha." },
    };
  }

  // Generate and store TOTP code
  const code = await createLoginCode(user.id, email);

  // Send email with code
  await sendCodeMail({ name: user.name, email, code });

  // Store identifier and rememberMe in session flash for verify page
  const authSession = await getAuthSession(request);
  authSession.flash("identifier", email);
  authSession.flash("rememberMe", rememberMe);

  throw redirect("/verify", {
    headers: {
      "Set-Cookie": await commitAuthSession(authSession),
    },
  });
}

/**
 * Ensures an ongoing onboarding session exists.
 *
 * Checks if there's flash data (identifier and rememberMe) in the auth session.
 * If not, redirects to login page.
 *
 * @param request - Request object
 * @returns The identifier and rememberMe flag from flash data
 */
export async function ensureOnboardingSession(request: Request) {
  const authSession = await getAuthSession(request);
  const identifier = authSession.get("identifier");
  const rememberMe = authSession.get("rememberMe");

  if (!identifier) {
    throw redirect("/login");
  }

  return { identifier, rememberMe: rememberMe ?? false };
}

/**
 * Verifies the onboarding code and completes authentication.
 *
 * Validates the TOTP code against the stored verification data.
 * If successful, creates a session and redirects to the app.
 * If failed, returns validation errors or redirects to login.
 *
 * @param request - Request object
 */
export async function verifyOnboarding(request: Request) {
  // Ensure we have an ongoing onboarding session
  const { identifier, rememberMe } = await ensureOnboardingSession(request);

  const formData = await request.formData();
  const code = String(formData.get("code")).trim();

  // Verify the TOTP code
  const result = await verifyLoginCode(identifier, code);

  if (!result.success) {
    // If no retry allowed (expired or too many attempts), redirect to login
    if (!result.retry) {
      // TODO: Add toast message before redirect
      throw redirect("/login");
    }
    // Allow retry - return error
    return {
      errors: { code: result.error },
    };
  }

  // Get user and create session
  const user = getUserByEmail(identifier);
  if (!user) {
    // This shouldn't happen since we validated the email earlier
    throw redirect("/login");
  }

  // Set expiration based on rememberMe flag
  const expiresDate = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    : new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

  const sessionId = createSession(user.id, expiresDate.toISOString());

  // Store session ID in auth cookie and redirect
  const authSession = await getAuthSession(request);
  authSession.set("sessionId", sessionId);

  throw redirect("/", {
    headers: {
      "Set-Cookie": await commitAuthSession(
        authSession,
        rememberMe ? { expires: expiresDate } : undefined,
      ),
    },
  });
}
