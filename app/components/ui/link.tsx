import type { LinkProps as _LinkProps } from 'react-router';
import type { VariantProps } from 'tailwind-variants';

import { use } from 'react';
import { Focusable, useFocusRing, useHover } from 'react-aria';
import { TooltipContext, useSlottedContext } from 'react-aria-components';
import { Link as _Link } from 'react-router';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';
import { ActionContext } from '~/components/ui/action-context';
import { Tooltip, TooltipTrigger } from '~/components/ui/tooltip';

const styles = tv({
  base: [focusVisibleStyles, 'rounded-md p-1 transition-all duration-300'],
  variants: {
    variant: {
      default: '',
      sidebar:
        'flex items-center gap-x-2 px-2 py-1.5 text-app-11 data-hovered:bg-app-3 data-hovered:text-app-12',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LinkProps extends _LinkProps, VariantProps<typeof styles> {
  tooltip?: string;
}

export function Link({ className, tooltip, variant, ...props }: LinkProps) {
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});
  const tooltipProps = useSlottedContext(TooltipContext);
  const ctx = use(ActionContext);

  function handleClick() {
    ctx?.onAction();
  }

  const link = (
    <_Link
      onClick={handleClick}
      className={styles({ className, variant })}
      {...(isFocusVisible && { 'data-focus-visible': true })}
      {...focusProps}
      {...(isHovered && { 'data-hovered': true })}
      {...hoverProps}
      {...props}
    />
  );

  if (tooltip) {
    return (
      <TooltipTrigger>
        <Focusable>{link}</Focusable>
        <Tooltip {...tooltipProps}>{tooltip}</Tooltip>
      </TooltipTrigger>
    );
  }

  return link;
}
