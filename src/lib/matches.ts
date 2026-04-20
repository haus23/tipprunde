import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { getMatches, createMatch, updateMatch } from "#db/dal/matches.ts";

export const fetchMatchesForRound = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(({ data }) => getMatches(data));

const matchDataSchema = v.object({
  roundId: v.number(),
  date: v.nullable(v.string()),
  leagueId: v.nullable(v.string()),
  hometeamId: v.nullable(v.string()),
  awayteamId: v.nullable(v.string()),
  result: v.nullable(v.string()),
});

export const createMatchFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(matchDataSchema)
  .handler(async ({ data }): Promise<void> => {
    await createMatch(data);
  });

export const updateMatchFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(
    v.object({ id: v.number(), ...v.omit(matchDataSchema, ["roundId"]).entries }),
  )
  .handler(async ({ data }): Promise<void> => {
    await updateMatch(data);
  });
