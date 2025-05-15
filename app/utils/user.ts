/*
 * User/Auth hooks for the client
 *
 * - useUser(): returns user object and auth state
 *
 */

import type { loader } from '~/root';

import { useRouteLoaderData } from 'react-router';

export function useUser() {
  const data = useRouteLoaderData<typeof loader>('root');

  return {
    isAuthenticated: !!data?.user,
    isAdmin: !!data?.user?.roles.includes('ADMIN'),
    current: data?.user || null,
  };
}
