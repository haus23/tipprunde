import { useRouteLoaderData } from 'react-router';
import * as v from 'valibot';

import type { loader } from '#/root';
import { type Theme, colorSchemeSchema } from './schema';

export function useTheme() {
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

  return { theme };
}
