import type { ButtonProps as _ButtonProps } from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';

import { Button as _Button } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';

const styles = tv({
  base: [
    focusVisibleStyles,
    'rounded-md border border-app-7 px-4 py-2 font-medium text-sm outline-offset-4',
  ],
  variants: {
    variant: {
      default: '',
      primary: 'bg-accent-9 text-white hover:bg-accent-10',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ButtonProps extends _ButtonProps, VariantProps<typeof styles> {
  className?: string;
}

export function Button({ className, variant, ...props }: ButtonProps) {
  return <_Button className={styles({ className, variant })} {...props} />;
}
