import { useCallback } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import * as v from "valibot";

import type { loader } from "~/root";

export const settingsSchema = v.object({
  sidebarCollapsed: v.optional(
    v.pipe(
      v.union([v.literal("true"), v.literal("false")]),
      v.transform((value) => value === "true"),
    ),
  ),
});

export type Settings = v.InferOutput<typeof settingsSchema>;

const defaultSettings = {
  sidebarCollapsed: false,
} satisfies Required<Settings>;

export function useSettings() {
  const data = useRouteLoaderData<typeof loader>("root");
  const fetcher = useFetcher();

  const setSettings = useCallback(
    async (settings: Partial<Settings>) => {
      await fetcher.submit(settings, {
        method: "POST",
        action: "/action/set-settings",
      });
    },
    [fetcher],
  );

  return {
    settings: { ...defaultSettings, ...data?.settings },
    setSettings,
  };
}
