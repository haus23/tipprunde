import * as v from 'valibot';

const envSchema = v.object({
  // Node
  NODE_ENV: v.optional(
    v.picklist(['development', 'production']),
    'development',
  ),

  // Root Email
  ROOT_EMAIL: v.pipe(v.string(), v.email()),

  // Sender Emails
  WELCOME_EMAIL: v.pipe(v.string(), v.email()),
  SECURITY_EMAIL: v.pipe(v.string(), v.email()),

  // TOTP Settings
  TOTP_PERIOD: v.pipe(v.string(), v.transform(Number)),
  TOTP_ATTEMPTS: v.pipe(v.string(), v.transform(Number)),

  // Secrets
  AUTH_SESSION_SECRET: v.string(),

  // Email SaaS tokens
  POSTMARK_TOKEN: v.string(),
  RESEND_TOKEN: v.string(),

  // Legacy Backend
  UNTERBAU_URL: v.string(),
});

export const env = v.parse(envSchema, process.env);
