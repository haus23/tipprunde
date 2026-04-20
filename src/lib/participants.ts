import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import { getPlayers, createPlayer, deletePlayer } from "#db/dal/players.ts";

const participantSchema = v.object({
  championshipId: v.number(),
  userId: v.number(),
});

export const fetchTurnierSpieler = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getPlayers(championshipId));

export const addTurnierSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(participantSchema)
  .handler(async ({ data }): Promise<void> => {
    await createPlayer(data.championshipId, data.userId);
  });

export const removeTurnierSpieler = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(participantSchema)
  .handler(async ({ data }): Promise<void> => {
    await deletePlayer(data.championshipId, data.userId);
  });
