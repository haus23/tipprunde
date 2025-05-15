/*
 * User/Auth hooks for the client
 *
 * - useUser(): returns user object and auth state
 *
 */

import type { loader } from '~/root';

import { useEffect, useRef } from 'react';
import { useRevalidator, useRouteLoaderData } from 'react-router';

export function useUser() {
  const data = useRouteLoaderData<typeof loader>('root');

  return {
    isAuthenticated: !!data?.user,
    isAdmin: !!data?.user?.roles.includes('ADMIN'),
    current: data?.user || null,
  };
}

export function useAuthBroadcast() {
  const user = useUser();
  const channelRef = useRef<BroadcastChannel>(undefined as never);
  const revalidator = useRevalidator();

  useEffect(() => {
    channelRef.current = new BroadcastChannel('auth');

    async function revalidate() {
      if (revalidator.state === 'idle') {
        await revalidator.revalidate();
      }
    }
    channelRef.current.addEventListener('message', revalidate);
    return () => {
      channelRef.current?.removeEventListener('message', revalidate);
      channelRef.current?.close();
    };
  }, [revalidator]);

  useEffect(() => {
    channelRef.current.postMessage(user.isAuthenticated);
  }, [user.isAuthenticated]);
}
