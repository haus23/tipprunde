import * as v from "valibot";

const envSchema = v.object({
  // Node
  NODE_ENV: v.optional(
    v.picklist(["development", "production"]),
    "development",
  ),

  // Secrets
  PREFS_SESSION_SECRET: v.string(),

  // DB path
  DATABASE_PATH: v.string(),
});

export const env = v.parse(envSchema, process.env);
