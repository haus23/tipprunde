import { generateTOTP, verifyTOTP } from "@epic-web/totp";
import { env } from "./env.server";
import {
  createVerification,
  getVerificationByIdentifier,
  updateVerification,
} from "~/lib/db/verifications";

/**
 * Generates and stores TOTP login code.
 *
 * @param userId User ID the code will be associated with
 * @param identifier Identifier (email, phone number, ...) the code will be associated with
 * @returns Code
 */
export async function createLoginCode(userId: number, identifier: string) {
  const { otp, period, ...otpProps } = await generateTOTP({
    period: env.TOTP_PERIOD,
  });

  const expiresAt = new Date(Date.now() + period * 1000).toISOString();
  createVerification({
    userId,
    identifier,
    expiresAt,
    period,
    ...otpProps,
  });

  return otp;
}

/**
 * Verifies given code for an identifier
 *
 * @param identifier Identifier code was generated for
 * @param code Code candidate
 * @returns Success or failure with error messages
 */
export async function verifyLoginCode(
  identifier: string,
  code: string,
): Promise<
  { success: true } | { success: false; retry: boolean; error: string }
> {
  const verificationData = getVerificationByIdentifier(identifier);
  if (!verificationData) {
    return {
      success: false,
      retry: false,
      error: "Kein Code für diese Email-Adresse vorhanden!",
    };
  }

  if (new Date() > new Date(verificationData.expiresAt)) {
    return {
      success: false,
      retry: false,
      error: "Code ist abgelaufen. Codes sind nur fünf Minuten gültig.",
    };
  }

  const isValid = await verifyTOTP({
    otp: code,
    ...verificationData,
  });
  if (isValid === null) {
    const attempts = verificationData.attempts + 1;
    const remainingAttempts = env.TOTP_ATTEMPTS - attempts;
    if (attempts < env.TOTP_ATTEMPTS) {
      updateVerification(identifier, attempts);
      return {
        success: false,
        retry: true,
        error: `Falscher Code. Noch ${remainingAttempts === 1 ? "ein letzter Versuch" : `${remainingAttempts} Versuche`} übrig.`,
      };
    }
    return {
      success: false,
      retry: false,
      error: "Zu viele falsche Versuche.",
    };
  }
  return { success: true };
}
