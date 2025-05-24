import type {
  TooltipProps as _TooltipProps,
  TooltipTriggerComponentProps as _TooltipTriggerComponentProps,
} from 'react-aria-components';

import { createContext, use } from 'react';
import {
  Tooltip as _Tooltip,
  TooltipTrigger as _TooltipTrigger,
  composeRenderProps,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

export const TooltipTriggerContext = createContext<
  Omit<TooltipTriggerComponentProps, 'children'>
>({});

interface TooltipTriggerComponentProps extends _TooltipTriggerComponentProps {}

export function TooltipTrigger({ ...props }: TooltipTriggerComponentProps) {
  const ctxProps = use(TooltipTriggerContext);
  const mergedProps = { ...ctxProps, ...props };
  return <_TooltipTrigger {...mergedProps} />;
}

const styles = tv({
  base: [
    'rounded-sm bg-app-12 px-2 py-1 text-app-1 text-sm shadow-sm transition duration-300',
    'data-[entering=true]:transform-[var(--origin)] data-[exiting=true]:transform-[var(--origin)]',
    'data-[entering=true]:opacity-0 data-[exiting=true]:opacity-0',
    'data-[placement=right]:ml-2',
  ],
});

interface TooltipProps extends _TooltipProps {}

export function Tooltip({ className, ...props }: TooltipProps) {
  return (
    <_Tooltip
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, className }),
      )}
      {...props}
    />
  );
}
