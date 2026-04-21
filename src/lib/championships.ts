import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";

import { getChampionship, getLatestChampionship, type Championship } from "#db/dal/championships.ts";
import { managerMiddleware } from "@/lib/auth/middleware.ts";

export type { Championship };

export const CHAMPIONSHIP_COOKIE = "current-championship";

export const fetchCurrentChampionship = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async (): Promise<Championship | null> => {
    const slug = getCookie(CHAMPIONSHIP_COOKIE);
    const championship = slug ? await getChampionship(slug) : null;
    return championship ?? (await getLatestChampionship()) ?? null;
  });

export const activateChampionship = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.string())
  .handler(async ({ data }): Promise<Championship | null> => {
    setCookie(CHAMPIONSHIP_COOKIE, data, { path: "/" });
    const championship = await getChampionship(data);
    return championship ?? null;
  });
