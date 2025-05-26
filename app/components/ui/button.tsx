import type {
  ButtonProps as _ButtonProps,
  PressEvent,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';

import { use } from 'react';
import {
  Button as _Button,
  TooltipContext,
  useSlottedContext,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';
import { ActionContext } from '~/components/ui/action-context';
import { Tooltip, TooltipTrigger } from '~/components/ui/tooltip';

const styles = tv({
  base: [
    focusVisibleStyles,
    'inline-flex items-center gap-x-2',
    'rounded-md transition-all duration-300',
    'disabled:pointer-events-none disabled:opacity-50',
    'px-4 py-2 font-medium text-sm',
  ],
  variants: {
    variant: {
      default: 'bg-app-9 text-white hover:bg-app-10',
      primary: 'bg-accent-9 text-white hover:bg-accent-10',
      outline: 'hover:bg-app-3',
      toolbar: 'data-[pressed=true]:bg-app-4',
      sidebar: 'grow px-2 py-1.5 text-base data-hovered:text-app-12',
    },
    iconOnly: {
      true: 'p-1.5',
    },
  },
  compoundVariants: [
    {
      variant: ['default', 'primary', 'outline'],
      className:
        'border border-app-7 outline-offset-4 data-[pressed=true]:scale-98',
    },
    {
      variant: ['toolbar', 'sidebar'],
      className: 'text-app-11 hover:bg-app-3',
    },
  ],
  defaultVariants: {
    variant: 'default',
  },
});

interface ButtonProps extends _ButtonProps, VariantProps<typeof styles> {
  className?: string;
  tooltip?: string;
}

export function Button({
  className,
  tooltip,
  variant,
  onPress,
  type = 'button',
  iconOnly,
  ...props
}: ButtonProps) {
  const tooltipProps = useSlottedContext(TooltipContext);
  const ctx = use(ActionContext);

  function handlePress(e: PressEvent) {
    onPress?.(e);
    ctx?.onAction();
  }

  const button = (
    <_Button
      className={styles({ className, iconOnly, variant })}
      onPress={handlePress}
      type={type}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <TooltipTrigger>
        {button}
        <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  }

  return button;
}
