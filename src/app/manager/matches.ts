import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { managerMiddleware } from "#/app/(auth)/guards.ts";
import type { TipRuleId } from "#/domain/rules.ts";
import { scoreTip } from "#/domain/scoring.ts";
import { createMatch, getMatches, getMatchWithRuleset, updateMatch } from "#db/dal/matches.ts";
import { getTipsByMatch, setTipPoints } from "#db/dal/tips.ts";

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

    const match = await getMatchWithRuleset(data.id);
    if (!match?.round?.championship?.ruleset) return;

    const tipRuleId = match.round.championship.ruleset.tipRuleId as TipRuleId;
    const result = match.result;
    const matchTips = await getTipsByMatch(data.id);

    await Promise.all(
      matchTips.map((tip) => {
        const points = result ? scoreTip(result, tip.tip, tip.joker ?? false, tipRuleId) : null;
        return setTipPoints({ matchId: data.id, userId: tip.userId, points });
      }),
    );
  });
