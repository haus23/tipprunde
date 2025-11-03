import { useCallback } from "react";
import { useFetcher } from "react-router";
import * as v from "valibot";

export const settingsSchema = v.object({
  sidebarCollapsed: v.optional(
    v.pipe(
      v.union([v.literal("true"), v.literal("false")]),
      v.transform((value) => value === "true"),
    ),
  ),
});

export type Settings = v.InferOutput<typeof settingsSchema>;

export function useSettings() {
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
    settings: { sidebarCollapsed: false },
    setSettings,
  };
}
