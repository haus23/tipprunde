"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

type Role = (typeof users.$inferSelect)["role"];

export type SpielerFormState = { success: true } | { error: string } | null;

export async function createSpieler(
  _prevState: SpielerFormState,
  formData: FormData,
): Promise<SpielerFormState> {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const email = (formData.get("email") as string) || null;
  const role = (formData.get("role") as Role) ?? "user";

  try {
    await db.insert(users).values({ name, slug, email, role });
    revalidatePath("/manager/stammdaten/spieler");
    return { success: true };
  } catch {
    return { error: "Fehler beim Anlegen. Kürzel oder E-Mail bereits vergeben?" };
  }
}

export async function updateSpieler(
  _prevState: SpielerFormState,
  formData: FormData,
): Promise<SpielerFormState> {
  const id = Number(formData.get("id"));
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const email = (formData.get("email") as string) || null;
  const role = (formData.get("role") as Role) ?? "user";

  try {
    await db.update(users).set({ name, slug, email, role }).where(eq(users.id, id));
    revalidatePath("/manager/stammdaten/spieler");
    return { success: true };
  } catch {
    return { error: "Fehler beim Speichern. Kürzel oder E-Mail bereits vergeben?" };
  }
}
