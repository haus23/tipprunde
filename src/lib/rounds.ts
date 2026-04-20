import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { getRounds, createRound as dalCreateRound, updateRound } from "#db/dal/rounds.ts";

export const fetchChampionshipRounds = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getRounds(championshipId));

export const createRound = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }): Promise<void> => {
    await dalCreateRound(championshipId);
  });

export const setRoundStatus = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.object({ roundId: v.number(), published: v.boolean() }))
  .handler(async ({ data }): Promise<void> => {
    await updateRound({ id: data.roundId, published: data.published });
  });
