import {
  type ButtonProps,
  Button as RACButton,
  composeRenderProps,
} from 'react-aria-components';

import { type VariantProps, tv } from '#/utils/tv';
import { focusRingStyles } from '../theme';

const styles = tv({
  extend: focusRingStyles,
  base: ['inline-flex items-center rounded-md p-1.5', 'transition-all'],
  variants: {
    variant: {
      default: '',
      pure: '',
      ghost:
        'border-2 data-[pressed]:scale-95 data-[hovered]:bg-grey-4 data-[pressed]:bg-grey-5',
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
