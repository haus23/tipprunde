import type { loader } from '~/root';

import { useRouteLoaderData } from 'react-router';

export type Theme = {
  colorScheme: 'light' | 'dark' | 'system';
  themeColor: 'mauvi';
};

export function useTheme() {
  const data = useRouteLoaderData<typeof loader>('root');

  return {
    theme: data?.theme || { colorScheme: 'system', themeColor: 'mauvi' },
  };
}
