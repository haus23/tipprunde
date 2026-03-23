import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { addRound, getChampionshipRounds, setRoundPublished } from "./rounds.server.ts";

export const fetchChampionshipRounds = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getChampionshipRounds(championshipId));

export const createRound = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }): Promise<void> => {
    await addRound(championshipId);
  });

export const setRoundStatus = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.object({ roundId: v.number(), published: v.boolean() }))
  .handler(async ({ data }): Promise<void> => {
    await setRoundPublished(data.roundId, data.published);
  });
