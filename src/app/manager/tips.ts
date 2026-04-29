import { createServerFn } from "@tanstack/react-start";
import * as v from "valibot";

import { managerMiddleware } from "#/app/(auth)/guards.ts";
import { getTipsByRoundAndUser, upsertTip } from "#db/dal/tips.ts";

export const fetchTipsFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.object({ roundId: v.number(), userId: v.number() }))
  .handler(({ data }) => getTipsByRoundAndUser(data));

export const saveTipFn = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(
    v.object({
      matchId: v.number(),
      userId: v.number(),
      tip: v.nullable(v.string()),
      joker: v.nullable(v.boolean()),
    }),
  )
  .handler(async ({ data }): Promise<void> => {
    await upsertTip(data);
  });
