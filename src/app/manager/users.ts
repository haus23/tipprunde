import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createUser, getUsers, updateUser } from "#db/dal/users.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { validateForm } from "@/lib/validate-form.ts";

export type UserFormState = { success: true } | { error: string } | null;

const userSchema = v.object({
  name: v.pipe(v.string(), v.nonEmpty()),
  slug: v.pipe(v.string(), v.nonEmpty()),
  email: v.union([v.literal(""), v.pipe(v.string(), v.email())]),
  role: v.picklist(["user", "manager", "admin"]),
});

const updateUserSchema = v.object({
  id: v.pipe(v.string(), v.toNumber()),
  ...userSchema.entries,
});

export const fetchUsersFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getUsers());

export const createUserFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(userSchema))
  .handler(async ({ data }): Promise<UserFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    const { email, ...rest } = data.output;
    try {
      await createUser({ ...rest, email: email || null });
      return { success: true };
    } catch {
      return { error: "Fehler beim Anlegen. Kürzel oder E-Mail bereits vergeben?" };
    }
  });

export const updateUserFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(updateUserSchema))
  .handler(async ({ data }): Promise<UserFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    const { id, email, ...rest } = data.output;
    try {
      await updateUser({ id, ...rest, email: email || null });
      return { success: true };
    } catch {
      return { error: "Fehler beim Speichern. Kürzel oder E-Mail bereits vergeben?" };
    }
  });
