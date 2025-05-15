import type { InputProps as _InputProps } from 'react-aria-components';

import { Input as _Input } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: [
    'rounded-md border border-app-7 px-3 py-1.5',
    'outline-hidden data-[focused=true]:ring-2 data-[focused=true]:ring-info-7',
  ],
});

interface InputProps extends _InputProps {
  className?: string;
}

export function Input({ className, ...props }: InputProps) {
  return <_Input className={styles({ className })} {...props} />;
}
