import * as v from 'valibot';

const envSchema = v.object({
  // Legacy Backend
  UNTERBAU_URL: v.string(),
});

export const env = v.parse(envSchema, process.env);
