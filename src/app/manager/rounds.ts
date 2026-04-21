import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createRound, getRounds, updateRound } from "#db/dal/rounds.ts";
import { managerMiddleware } from "#/app/(auth)/guards.ts";

const updateRoundSchema = v.object({
  id: v.number(),
  published: v.optional(v.boolean()),
  tipsPublished: v.optional(v.boolean()),
  completed: v.optional(v.boolean()),
  isDoubleRound: v.optional(v.boolean()),
});

export const fetchChampionshipRoundsFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getRounds(championshipId));

export const createRoundFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }): Promise<void> => {
    await createRound(championshipId);
  });

export const updateRoundFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(updateRoundSchema)
  .handler(async ({ data }): Promise<void> => {
    await updateRound(data);
  });
