import { tv } from '#/utils/tv';

export const focusRingStyles = tv({
  base: 'outline-none',
  variants: {
    isFocusVisible: {
      true: 'ring-2 ring-accent-7 ring-offset-2 ring-offset-grey-1',
    },
  },
});
