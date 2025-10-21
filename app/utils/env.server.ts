import * as v from "valibot";

const envSchema = v.object({
  // Node
  NODE_ENV: v.optional(
    v.picklist(["development", "production"]),
    "development",
  ),

  // Secrets
  AUTH_SESSION_SECRET: v.string(),

  // TOTP Settings
  TOTP_PERIOD: v.pipe(v.string(), v.transform(Number)),
  TOTP_ATTEMPTS: v.pipe(v.string(), v.transform(Number)),
});

export const env = v.parse(envSchema, process.env);
