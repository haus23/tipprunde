"use client";

import { type CSSProperties } from "react";
import { flushSync } from "react-dom";
import {
  Button,
  UNSTABLE_Toast as Toast,
  UNSTABLE_ToastContent as ToastContent,
  UNSTABLE_ToastQueue as ToastQueue,
  UNSTABLE_ToastRegion as ToastRegion,
  Text,
} from "react-aria-components/Toast";
import { XIcon } from "lucide-react";

interface ToastContent {
  title: string;
  description?: string;
}

export const toastQueue = new ToastQueue<ToastContent>({
  wrapUpdate(fn) {
    if ("startViewTransition" in document) {
      document.startViewTransition(() => {
        flushSync(fn);
      });
    } else {
      fn();
    }
  },
});

export function AppToastRegion() {
  return (
    <ToastRegion
      queue={toastQueue}
      className="fixed right-4 bottom-4 z-50 flex flex-col-reverse gap-2 outline-none focus-visible:ring-2 focus-visible:ring-focus"
    >
      {({ toast }) => (
        <Toast
          toast={toast}
          style={{ viewTransitionName: toast.key } as CSSProperties}
          className="bg-success flex w-72 items-center gap-3 rounded-lg px-4 py-3 text-sm text-[white] shadow-lg outline-none [view-transition-class:toast] focus-visible:ring-2 focus-visible:ring-[white]"
        >
          <ToastContent className="flex min-w-0 flex-1 flex-col gap-0.5">
            <Text slot="title" className="font-medium">{toast.content.title}</Text>
            {toast.content.description && (
              <Text slot="description" className="text-xs opacity-80">{toast.content.description}</Text>
            )}
          </ToastContent>
          <Button
            slot="close"
            aria-label="Schließen"
            className="flex size-8 shrink-0 cursor-default items-center justify-center rounded-md opacity-70 outline-none transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[white]"
          >
            <XIcon size={16} />
          </Button>
        </Toast>
      )}
    </ToastRegion>
  );
}
