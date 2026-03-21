import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import {
  addPlayerToChampionship,
  getChampionshipPlayers,
  removePlayerFromChampionship,
} from "@/lib/participants.server.ts";

const participantSchema = v.object({
  championshipId: v.number(),
  userId: v.number(),
});

export const fetchTurnierSpieler = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getChampionshipPlayers(championshipId));

export const addTurnierSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(participantSchema)
  .handler(async ({ data }): Promise<void> => {
    await addPlayerToChampionship(data.championshipId, data.userId);
  });

export const removeTurnierSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(participantSchema)
  .handler(async ({ data }): Promise<void> => {
    await removePlayerFromChampionship(data.championshipId, data.userId);
  });
