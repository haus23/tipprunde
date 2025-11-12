import { redirect } from "react-router";
import { getUserByEmail } from "../db/users";

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
    return {
      errors: { email: "Unbekannte Email-Adresse. Wende dich an Micha." },
    };
  }

  throw redirect("/verify");
}
