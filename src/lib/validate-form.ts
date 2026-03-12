import { type BaseSchema, type BaseIssue, safeParse } from "valibot";

export function validateForm<
  const TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(schema: TSchema) {
  return (formData: FormData) => safeParse(schema, Object.fromEntries(formData));
}
