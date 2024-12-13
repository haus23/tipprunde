import { useFetcher, useRouteLoaderData } from 'react-router';
import * as v from 'valibot';

import { useCallback } from 'react';
import type { loader } from '#/root';
import { type Theme, colorSchemeSchema } from './schema';

export function useTheme() {
  const fetcher = useFetcher();
  const data = useRouteLoaderData<typeof loader>('root');

  const persistedColorScheme = v.safeParse(
    colorSchemeSchema,
    data?.requestInfo.theme?.colorScheme,
  );
  const colorScheme = persistedColorScheme.success
    ? persistedColorScheme.output
    : 'light';

  const theme = {
    colorScheme,
    themeColor: 'default' as const,
  } satisfies Theme;

  const setTheme = useCallback(
    (theme: Theme) => {
      fetcher.submit(theme, { method: 'POST', action: '/actions/set-theme' });
    },
    [fetcher],
  );

  return { theme, setTheme };
}
