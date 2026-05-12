import { db } from "$lib/server/db";

import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const championship = await db.query.championships.findFirst({
    orderBy: { nr: "desc" },
    where: { published: true },
    with: { rulesets: true },
  });
  return { championship };
};
