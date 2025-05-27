import type {
  SearchFieldProps as _SearchFieldProps,
  TextFieldProps as _TextFieldProps,
} from 'react-aria-components';
import type { VariantProps } from 'tailwind-variants';

import {
  SearchField as _SearchField,
  TextField as _TextField,
} from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { FieldError } from '~/components/ui/field-error';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

const styles = tv({
  base: ['flex'],
  variants: {
    orientation: {
      horizontal: ['flex-row items-center gap-x-2'],
      vertical: ['flex-col gap-y-2'],
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

interface TextFieldProps extends _TextFieldProps, VariantProps<typeof styles> {
  label: string;
  labelClasses?: string;
  className?: string;
  placeholder?: string;
}

export function TextField({
  label,
  labelClasses,
  className,
  placeholder,
  orientation,
  ...props
}: TextFieldProps) {
  return (
    <_TextField {...props} className={styles({ orientation, className })}>
      <Label className={labelClasses}>{label}</Label>
      <Input placeholder={placeholder} className="grow" />
      <FieldError className="text-sm" />
    </_TextField>
  );
}

interface SearchFieldProps
  extends _SearchFieldProps,
    VariantProps<typeof styles> {
  label: string;
  labelClasses?: string;
  className?: string;
  placeholder?: string;
}

export function SearchField({
  label,
  labelClasses,
  className,
  placeholder,
  orientation,
  ...props
}: SearchFieldProps) {
  return (
    <_SearchField {...props} className={styles({ orientation, className })}>
      <Label className={labelClasses}>{label}</Label>
      <Input placeholder={placeholder} className="grow" />
      <FieldError className="text-sm" />
    </_SearchField>
  );
}
