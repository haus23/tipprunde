import { createCookieSessionStorage } from "react-router";
import { env } from "./env.server";
import { getUserByEmail } from "./db/users";
import { redirect } from "react-router";
import { createLoginCode } from "./totp.server";

// The Auth Session
//

type AuthSessionData = {};

type AuthSessionFlashData = {
  email: string;
};

const authSessionStorage = createCookieSessionStorage<
  AuthSessionData,
  AuthSessionFlashData
>({
  cookie: {
    name: "__auth",
    sameSite: "lax",
    path: "/",
    httpOnly: true,
    secrets: [env.AUTH_SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

async function getAuthSession(request: Request) {
  return authSessionStorage.getSession(request.headers.get("Cookie"));
}

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
  const email = String(formData.get("email"));

  const user = await getUserByEmail(email);

  if (!user) {
    return {
      errors: { email: "Unbekannte Email-Adresse. Wende dich an Micha." },
    };
  }

  const code = await createLoginCode(email);
  console.log("CODE", code);

  const session = await getAuthSession(request);
  session.flash("email", email);

  throw redirect("/verify", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}
