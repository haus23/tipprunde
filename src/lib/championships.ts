import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import * as v from "valibot";
import { managerMiddleware } from "@/lib/auth/middleware.ts";
import {
  getChampionshipBySlug,
  getLatestChampionship,
} from "@/lib/championships.server.ts";
import type { championships } from "@/lib/db/schema.ts";

export const CHAMPIONSHIP_COOKIE = "current-championship";

export type Championship = typeof championships.$inferSelect;

export const fetchCurrentChampionship = createServerFn({ method: "GET" })
  .middleware([managerMiddleware])
  .handler(async (): Promise<Championship | null> => {
    const slug = getCookie(CHAMPIONSHIP_COOKIE);
    const championship = slug
      ? await getChampionshipBySlug(slug)
      : await getLatestChampionship();
    return championship ?? null;
  });

export const activateChampionship = createServerFn({ method: "POST" })
  .middleware([managerMiddleware])
  .inputValidator(v.string())
  .handler(async ({ data }): Promise<Championship | null> => {
    setCookie(CHAMPIONSHIP_COOKIE, data, { path: "/" });
    const championship = await getChampionshipBySlug(data);
    return championship ?? null;
  });
