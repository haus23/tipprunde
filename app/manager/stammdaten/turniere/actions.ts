"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { championships } from "@/lib/db/schema";

export type TurnierFormState = { success: true } | { error: string } | null;

export async function createTurnier(
  _prev: TurnierFormState,
  formData: FormData,
): Promise<TurnierFormState> {
  const slug = formData.get("slug") as string;
  const name = formData.get("name") as string;
  const nr = Number(formData.get("nr"));
  const rulesetId = formData.get("rulesetId") as string;

  try {
    await db.insert(championships).values({ slug, name, nr, rulesetId });
  } catch {
    return { error: "Turnier konnte nicht angelegt werden." };
  }

  revalidatePath("/manager/stammdaten/turniere");
  return { success: true };
}
