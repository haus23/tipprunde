import { generateTOTP } from "@epic-web/totp";
import { env } from "./env.server";
import { createVerification } from "./db/verifications";

/**
 * Generates and stores TOTP login code.
 *
 * @param email User email the code will be associated with
 * @returns Code
 */
export async function createLoginCode(email: string) {
  const { otp, period, ...otpProps } = await generateTOTP({
    period: env.TOTP_PERIOD,
  });

  const expires = new Date(Date.now() + period * 1000);
  await createVerification({
    email,
    expires,
    period,
    ...otpProps,
  });

  return otp;
}
