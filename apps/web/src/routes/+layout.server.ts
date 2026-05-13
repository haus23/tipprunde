import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
  const championship = await db.query.championships.findFirst({
    orderBy: { nr: "desc" },
    where: { published: true },
    with: { ruleset: true },
  });

  if (!championship) {
    error(404, "Kein Turnier gefunden.");
  }

  return { championship, user: locals.user };
};
