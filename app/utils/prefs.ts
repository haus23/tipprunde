import type { loader } from '~/root';

import { useCallback } from 'react';
import { useFetcher, useRouteLoaderData } from 'react-router';
import * as v from 'valibot';

export const themeSchema = v.object({
  colorScheme: v.fallback(v.picklist(['light', 'dark', 'system']), 'system'),
  themeColor: v.fallback(v.picklist(['mauvi']), 'mauvi'),
});

export type Theme = v.InferOutput<typeof themeSchema>;

export function useTheme() {
  const data = useRouteLoaderData<typeof loader>('root');
  const fetcher = useFetcher();

  const setTheme = useCallback(
    async (theme: Theme) => {
      await fetcher.submit(theme, {
        method: 'POST',
        action: '/action/set-theme',
      });
    },
    [fetcher],
  );

  return {
    theme: data?.theme || { colorScheme: 'system', themeColor: 'mauvi' },
    setTheme,
  };
}

export const settingsSchema = v.object({
  sidebarCollapsed: v.pipe(
    v.string(),
    v.transform((v) => v === 'true'),
  ),
});

export type Settings = v.InferOutput<typeof settingsSchema>;

export function useSettings() {
  const data = useRouteLoaderData<typeof loader>('root');
  const fetcher = useFetcher();

  const setSettings = useCallback(
    async (settings: Settings) => {
      await fetcher.submit(settings, {
        method: 'POST',
        action: '/action/set-settings',
      });
    },
    [fetcher],
  );

  return {
    settings: data?.settings || { sidebarCollapsed: false },
    setSettings,
  };
}
