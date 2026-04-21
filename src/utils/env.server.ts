import * as v from "valibot";

const envSchema = v.object({
  NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "development"),

  TURSO_DATABASE_URL: v.pipe(v.string(), v.nonEmpty()),
  TURSO_AUTH_TOKEN: v.pipe(v.string(), v.nonEmpty()),

  SESSION_SECRET: v.pipe(v.string(), v.nonEmpty()),
  SESSION_DURATION_DEFAULT: v.pipe(v.string(), v.toNumber()),
  SESSION_DURATION_REMEMBER: v.pipe(v.string(), v.toNumber()),

  APP_SECRET: v.pipe(v.string(), v.nonEmpty()),
  TOTP_EXPIRES_IN: v.pipe(v.string(), v.toNumber()),
  TOTP_MAX_ATTEMPTS: v.pipe(v.string(), v.toNumber()),

  RESEND_API_KEY: v.pipe(v.string(), v.nonEmpty()),
  FROM_EMAIL: v.pipe(v.string(), v.nonEmpty()),
});

export const env = v.parse(envSchema, process.env);
