import type { PopoverProps as _PopoverProps } from 'react-aria-components';

import { Popover as _Popover } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: ['rounded-xl border border-app-6 bg-app-1 shadow-md'],
});

interface PopoverProps extends _PopoverProps {
  className?: string;
}
export function Popover({ className, ...props }: PopoverProps) {
  return <_Popover className={styles({ className })} {...props} />;
}
