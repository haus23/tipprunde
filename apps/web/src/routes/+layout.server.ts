import { db } from "$lib/server/db";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
  const championship = await db.query.championships.findFirst({
    orderBy: { nr: "desc" },
    where: { published: true },
    with: { rulesets: true },
  });
  return { championship };
};
