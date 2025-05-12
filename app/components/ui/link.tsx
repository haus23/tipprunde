import type { LinkProps as _LinkProps } from 'react-router';
import type { VariantProps } from 'tailwind-variants';

import { useFocusRing, useHover } from 'react-aria';
import { Link as _Link } from 'react-router';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';

const styles = tv({
  base: [focusVisibleStyles, 'rounded-md p-1'],
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

export interface LinkProps extends _LinkProps, VariantProps<typeof styles> {}

export function Link({ className, variant, ...props }: LinkProps) {
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  return (
    <_Link
      className={styles({ className, variant })}
      {...(isFocusVisible && { 'data-focus-visible': true })}
      {...focusProps}
      {...(isHovered && { 'data-hovered': true })}
      {...hoverProps}
      {...props}
    />
  );
}
