"use server";

import { redirect } from "next/navigation";
import { setSessionCookie } from "./cookie";
import { sendTotpEmail } from "./email";
import { createSession } from "./session";
import { createTotpCode, verifyTotpCode } from "./totp";
import { getUserByEmail } from "./users";

type RequestCodeState = { success: true; email: string } | { success: false; error: string } | null;

type VerifyCodeState = { error: string } | null;

export async function requestCode(
  _prevState: RequestCodeState,
  formData: FormData,
): Promise<RequestCodeState> {
  const email = formData.get("email") as string;

  const user = await getUserByEmail(email);

  if (!user) {
    return { success: false, error: "Keine Zugangsberechtigung für diese E-Mail-Adresse." };
  }

  const code = await createTotpCode(user.id);

  try {
    await sendTotpEmail(email, code);
  } catch {
    return {
      success: false,
      error: "E-Mail konnte nicht gesendet werden. Bitte versuche es erneut.",
    };
  }

  return { success: true, email };
}

export async function verifyCode(
  _prevState: VerifyCodeState,
  formData: FormData,
): Promise<VerifyCodeState> {
  const email = formData.get("email") as string;
  const code = formData.get("code") as string;
  const rememberMe = formData.get("rememberMe") === "on";

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: "Ungültige Anfrage." };
  }

  const result = await verifyTotpCode(user.id, code);

  if (result === "expired") {
    return { error: "Der Code ist abgelaufen. Bitte fordere einen neuen an." };
  }

  if (result === "max_attempts") {
    return { error: "Zu viele Fehlversuche. Bitte fordere einen neuen Code an." };
  }

  if (result === "invalid") {
    return { error: "Falscher Code. Bitte versuche es erneut." };
  }

  const sessionId = await createSession(user.id, rememberMe);
  await setSessionCookie(sessionId, user.role, rememberMe);

  redirect("/manager");
}
