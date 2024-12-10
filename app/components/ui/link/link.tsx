import {
  type LinkProps,
  type NavLinkProps,
  Link as RRLink,
  NavLink as RRNavLink,
} from 'react-router';

import { useFocusRing } from 'react-aria';
import {
  LinkContext,
  composeRenderProps,
  useSlottedContext,
} from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { type VariantProps, tv } from '#/utils/tv';
import { focusRingStyles } from '../theme';

const linkStyles = tv({
  extend: focusRingStyles,
  base: 'rounded-sm',
});

namespace Link {
  export interface Props extends LinkProps, VariantProps<typeof linkStyles> {}
}

export function Link({ className, ...props }: Link.Props) {
  const { focusProps, isFocusVisible } = useFocusRing();

  // Delegate click event to press event context handler
  const linkContext = useSlottedContext(LinkContext);
  function handleClick() {
    if (linkContext?.onPress) {
      linkContext.onPress(undefined as never);
    }
  }

  return (
    <RRLink
      className={twMerge(linkStyles({ isFocusVisible, className }))}
      onClick={handleClick}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
      {...focusProps}
      {...props}
    />
  );
}

const navLinkStyles = tv({
  extend: linkStyles,
  base: 'px-2 py-1 transition-colors aria-[current]:text-accent-11',
});

namespace NavLink {
  export interface Props
    extends NavLinkProps,
      VariantProps<typeof navLinkStyles> {}
}

export function NavLink({ className, ...props }: NavLink.Props) {
  const { focusProps, isFocusVisible } = useFocusRing();

  // Delegate click event to press event context handler
  const linkContext = useSlottedContext(LinkContext);
  function handleClick() {
    if (linkContext?.onPress) {
      linkContext.onPress(undefined as never);
    }
  }

  return (
    <RRNavLink
      className={composeRenderProps(className, (className, renderProps) =>
        navLinkStyles({ ...renderProps, isFocusVisible, className }),
      )}
      onClick={handleClick}
      {...{ 'data-focus-visible': isFocusVisible || undefined }}
      {...focusProps}
      {...props}
    />
  );
}
