import type { TextFieldProps as _TextFieldProps } from 'react-aria-components';

import { TextField as _TextField } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { FieldError } from '~/components/ui/field-error';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const styles = tv({
  base: ['flex flex-col gap-y-2'],
});

interface TextFieldProps extends _TextFieldProps {
  label: string;
  className?: string;
  placeholder?: string;
}

export function TextField({
  label,
  className,
  placeholder,
  ...props
}: TextFieldProps) {
  return (
    <_TextField {...props} className={styles({ className })}>
      <Label>{label}</Label>
      <Input placeholder={placeholder} />
      <FieldError className="text-sm" />
    </_TextField>
  );
}
