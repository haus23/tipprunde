import type { SeparatorProps } from 'react-aria-components';

import { Separator as _Separator } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';

export function Separator({
  className,
  orientation,
  ...props
}: SeparatorProps) {
  return (
    <_Separator
      className={twMerge(orientation === 'vertical' && 'border-l', className)}
      orientation={orientation}
      {...props}
    />
  );
}
