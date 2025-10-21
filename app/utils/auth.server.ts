import { createCookieSessionStorage } from "react-router";
import { env } from "./env.server";
import { getUserByEmail } from "./db/users";
import { redirect } from "react-router";
import { createLoginCode, verifyLoginCode } from "./totp.server";
import { createSession } from "./db/sessions";

// The Auth Session
//

type AuthSessionData = {
  sessionId: string;
};

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

  if (!email) {
    throw redirect("/login");
  }

  const user = await getUserByEmail(email);
  if (!user) throw Error("Netter Versuch!");

  const formData = await request.formData();
  const code = String(formData.get("code"));
  console.log(email, code);

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
          "Set-Cookie": await authSessionStorage.commitSession(session),
        },
      });
    }
    return { errors: { code: verifyResult.error } };
  }

  // Create the app session
  const expirationDate = new Date(Date.now() + env.SESSION_DURATION * 1000);
  const { id: sessionId } = await createSession(user.id, expirationDate, false);

  session.set("sessionId", sessionId);

  throw redirect("/", {
    headers: {
      "Set-Cookie": await authSessionStorage.commitSession(session),
    },
  });
}
