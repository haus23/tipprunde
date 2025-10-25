import * as v from "valibot";

const envSchema = v.object({
  // Node
  NODE_ENV: v.optional(
    v.picklist(["development", "production"]),
    "development",
  ),

  // Root Email
  ROOT_EMAIL: v.pipe(v.string(), v.email()),

  // Sender Emails
  WELCOME_EMAIL: v.pipe(v.string(), v.email()),

  // Secrets
  AUTH_SESSION_SECRET: v.string(),

  // TOTP Settings
  TOTP_PERIOD: v.pipe(v.string(), v.transform(Number)),
  TOTP_ATTEMPTS: v.pipe(v.string(), v.transform(Number)),

  // Session duration (server maximum)
  SESSION_DURATION: v.pipe(v.string(), v.transform(Number)),

  // Email SaaS tokens
  POSTMARK_TOKEN: v.string(),
  RESEND_TOKEN: v.string(),
});

export const env = v.parse(envSchema, process.env);
