import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";

import { db } from "#/lib/db.server.ts";

const getRuleset = createServerFn()
  .validator((championshipId: number) => championshipId)
  .handler(async ({ data: championshipId }) => {
    const championship = await db.query.championships.findFirst({
      where: { id: championshipId },
      columns: { id: true },
      with: { ruleset: true },
    });
    return { ruleset: championship?.ruleset ?? null };
  });

export type Ruleset = NonNullable<Awaited<ReturnType<typeof getRuleset>>["ruleset"]>;

export const rulesetQueryOptions = (championshipId: number) =>
  queryOptions({
    queryKey: ["ruleset", championshipId],
    queryFn: () => getRuleset({ data: championshipId }),
  });
