import type { FieldErrorProps as _FieldErrorProps } from 'react-aria-components';

import { FieldError as _FieldError } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const styles = tv({
  base: ['text-error'],
});

interface FieldErrorProps extends _FieldErrorProps {
  className?: string;
}

export function FieldError({ className, ...props }: FieldErrorProps) {
  return <_FieldError className={styles({ className })} {...props} />;
}
