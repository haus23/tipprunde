import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createMatch, getMatches, updateMatch } from "#db/dal/matches.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";

const matchSchema = v.object({
  roundId: v.number(),
  date: v.nullable(v.string()),
  leagueId: v.nullable(v.string()),
  hometeamId: v.nullable(v.string()),
  awayteamId: v.nullable(v.string()),
  result: v.nullable(v.string()),
});

const updateMatchSchema = v.object({
  id: v.number(),
  ...v.omit(matchSchema, ["roundId"]).entries,
});

export const fetchMatchesForRoundFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(({ data }) => getMatches(data));

export const createMatchFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(matchSchema)
  .handler(async ({ data }): Promise<void> => {
    await createMatch(data);
  });

export const updateMatchFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(updateMatchSchema)
  .handler(async ({ data }): Promise<void> => {
    await updateMatch(data);
  });
