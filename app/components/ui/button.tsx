import type { ButtonProps as _ButtonProps } from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';

import { Button as _Button } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { focusVisibleStyles } from '~/components/ui/_common';

const styles = tv({
  base: [focusVisibleStyles, 'rounded-md transition-all duration-300'],
  variants: {
    variant: {
      default: '',
      primary: 'bg-accent-9 text-white hover:bg-accent-10',
      sidebar:
        'flex grow items-center gap-x-2 px-2 py-1.5 text-app-11 data-hovered:bg-app-3 data-hovered:text-app-12',
      toolbar: 'p-1.5 hover:bg-app-3 data-[pressed=true]:bg-app-4',
    },
  },
  compoundVariants: [
    {
      variant: ['default', 'primary'],
      className:
        'border border-app-7 px-4 py-2 font-medium text-sm outline-offset-4 data-[pressed=true]:scale-98',
    },
  ],
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
