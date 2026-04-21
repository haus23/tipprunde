import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { createPlayer, deletePlayer, getPlayers } from "#db/dal/players.ts";
import { managerMiddleware } from "#/app/(auth)/guards.ts";

const playerSchema = v.object({
  championshipId: v.number(),
  userId: v.number(),
});

export const fetchPlayersFn = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .inputValidator(v.number())
  .handler(async ({ data: championshipId }) => getPlayers(championshipId));

export const addPlayerFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(playerSchema)
  .handler(async ({ data }): Promise<void> => {
    await createPlayer(data.championshipId, data.userId);
  });

export const removePlayerFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(playerSchema)
  .handler(async ({ data }): Promise<void> => {
    await deletePlayer(data.championshipId, data.userId);
  });
