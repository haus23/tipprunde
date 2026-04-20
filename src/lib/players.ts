import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { validateForm } from "@/lib/validate-form.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { getUsers, createUser, updateUser } from "#db/dal/users.ts";

export type SpielerFormState = { success: true } | { error: string } | null;

const spielerSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1)),
  slug: v.pipe(v.string(), v.minLength(1)),
  email: v.pipe(
    v.string(),
    v.transform((val) => val.trim() || undefined),
    v.optional(v.pipe(v.string(), v.email())),
  ),
  role: v.picklist(["user", "manager", "admin"]),
});

const updateSpielerSchema = v.object({
  id: v.pipe(v.string(), v.transform(Number)),
  ...spielerSchema.entries,
});

export const fetchPlayers = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async () => getUsers());

export const createSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(spielerSchema))
  .handler(async ({ data }): Promise<SpielerFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    const { email, ...rest } = data.output;
    try {
      await createUser({ ...rest, email: email ?? null });
      return { success: true };
    } catch {
      return { error: "Fehler beim Anlegen. Kürzel oder E-Mail bereits vergeben?" };
    }
  });

export const updateSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(validateForm(updateSpielerSchema))
  .handler(async ({ data }): Promise<SpielerFormState> => {
    if (!data.success) return { error: "Ungültige Eingabe." };
    const { id, email, ...rest } = data.output;
    try {
      await updateUser({ id, ...rest, email: email ?? null });
      return { success: true };
    } catch {
      return { error: "Fehler beim Speichern. Kürzel oder E-Mail bereits vergeben?" };
    }
  });
