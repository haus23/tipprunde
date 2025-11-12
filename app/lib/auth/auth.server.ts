import { redirect } from "react-router";
import { getUserByEmail } from "../db/users";
import { createLoginCode } from "~/utils/totp.server";
import { sendCodeMail, sendSecurityLogMail } from "~/utils/emails.server";
import { commitAuthSession, getAuthSession } from "./session.server";

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
