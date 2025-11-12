import * as v from "valibot";

const envSchema = v.object({
  // Node
  NODE_ENV: v.optional(
    v.picklist(["development", "test", "staging", "production"]),
    "development",
  ),

  // Secrets
  PREFS_SESSION_SECRET: v.string(),

  // DB path
  DATABASE_PATH: v.string(),

  // TOTP Settings (period the code is valid in seconds and max attempts to enter the code)
  TOTP_PERIOD: v.pipe(v.string(), v.transform(Number)),
  TOTP_ATTEMPTS: v.pipe(v.string(), v.transform(Number)),

  // Root Email
  ROOT_EMAIL: v.pipe(v.string(), v.email()),

  // Email sender addresses
  WELCOME_EMAIL: v.pipe(v.string(), v.email()),
  SECURITY_EMAIL: v.pipe(v.string(), v.email()),

  // Email SaaS token
  RESEND_TOKEN: v.string(),
});

export const env = v.parse(envSchema, process.env);
