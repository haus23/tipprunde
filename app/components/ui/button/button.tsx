import {
  type ButtonProps,
  Button as RACButton,
  composeRenderProps,
} from 'react-aria-components';

import { type VariantProps, tv } from '#/utils/tv';

const styles = tv({
  base: [
    'inline-flex items-center rounded-md border-2 p-1.5',
    'outline-hidden data-[focus-visible]:ring-2 data-[focus-visible]:ring-accent-7 data-[focus-visible]:ring-offset-2 data-[focus-visible]:ring-offset-grey-1',
    'transition-all data-[pressed]:scale-95 data-[hovered]:bg-grey-4 data-[pressed]:bg-grey-5',
  ],
  variants: {
    variant: {
      default: '',
      ghost: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

namespace Button {
  export interface Props extends ButtonProps, VariantProps<typeof styles> {}
}

export function Button({ className, variant, ...props }: Button.Props) {
  return (
    <RACButton
      className={composeRenderProps(className, (className, renderProps) =>
        styles({ ...renderProps, variant, className }),
      )}
      type="button"
      {...props}
    />
  );
}
