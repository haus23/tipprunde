import type { loader } from '~/root';

import { useEffect } from 'react';
import {
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_Toast as ToastDisplay,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
} from 'react-aria-components';
import { flushSync } from 'react-dom';
import { useRouteLoaderData } from 'react-router';
import { tv } from 'tailwind-variants';

export type Toast = {
  type: 'success' | 'info' | 'error';
  message: string;
};

const toastQueue = new ToastQueue<Toast>({
  // Wrap state updates in a CSS view transition.
  wrapUpdate(fn) {
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});

const regionStyles = tv({
  base: [
    'fixed right-4 bottom-4',
    'reverse flex flex-col flex-col-reverse gap-4',
  ],
});

const toastStyles = tv({
  base: [
    '[view-transition-class:toast]',
    'flex max-w-xs items-center gap-x-2 md:max-w-md',
    'rounded-md px-4 py-2 shadow-sm',
  ],
  variants: {
    type: {
      success: ['bg-success-3'],
      info: ['bg-app-3'],
      error: ['bg-error-3'],
    },
  },
  defaultVariants: {
    type: 'info',
  },
});

export function Toaster() {
  const data = useRouteLoaderData<typeof loader>('root');

  useEffect(() => {
    if (data?.toast) {
      toastQueue.add(data.toast, { timeout: 5000 });
    }
  }, [data?.toast]);

  return (
    <ToastRegion queue={toastQueue} className={regionStyles}>
      {({ toast }) => (
        <ToastDisplay
          toast={toast}
          style={{ viewTransitionName: toast.key }}
          className={toastStyles({ type: toast.content.type })}
        >
          <ToastContent>{toast.content.message}</ToastContent>
        </ToastDisplay>
      )}
    </ToastRegion>
  );
}
