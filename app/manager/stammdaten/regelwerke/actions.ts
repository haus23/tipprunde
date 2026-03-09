"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { rulesets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export type RegelwerkFormState = { success: true } | { error: string } | null;

export async function createRegelwerk(
  _prev: RegelwerkFormState,
  formData: FormData,
): Promise<RegelwerkFormState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const tipRuleId = formData.get("tipRuleId") as string;
  const jokerRuleId = formData.get("jokerRuleId") as string;
  const matchRuleId = formData.get("matchRuleId") as string;
  const roundRuleId = formData.get("roundRuleId") as string;
  const extraQuestionRuleId = formData.get("extraQuestionRuleId") as string;

  try {
    await db.insert(rulesets).values({
      id,
      name,
      description,
      tipRuleId,
      jokerRuleId,
      matchRuleId,
      roundRuleId,
      extraQuestionRuleId,
    });
  } catch {
    return { error: "Regelwerk konnte nicht angelegt werden." };
  }

  revalidatePath("/manager/stammdaten/regelwerke");
  return { success: true };
}

export async function updateRegelwerk(
  _prev: RegelwerkFormState,
  formData: FormData,
): Promise<RegelwerkFormState> {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const tipRuleId = formData.get("tipRuleId") as string;
  const jokerRuleId = formData.get("jokerRuleId") as string;
  const matchRuleId = formData.get("matchRuleId") as string;
  const roundRuleId = formData.get("roundRuleId") as string;
  const extraQuestionRuleId = formData.get("extraQuestionRuleId") as string;

  try {
    await db
      .update(rulesets)
      .set({ name, description, tipRuleId, jokerRuleId, matchRuleId, roundRuleId, extraQuestionRuleId })
      .where(eq(rulesets.id, id));
  } catch {
    return { error: "Regelwerk konnte nicht gespeichert werden." };
  }

  revalidatePath("/manager/stammdaten/regelwerke");
  return { success: true };
}
