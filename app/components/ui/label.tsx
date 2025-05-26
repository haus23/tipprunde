import type { LabelProps as _LabelProps } from 'react-aria-components';

import { Label as _Label } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

interface LabelProps extends _LabelProps {}

export function Label({ className, ...props }: LabelProps) {
  return (
    <_Label
      className={twMerge('font-semibold text-sm', className)}
      {...props}
    />
  );
}
