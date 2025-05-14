import type { TextFieldProps as _TextFieldProps } from 'react-aria-components';

import { TextField as _TextField } from 'react-aria-components';
import { tv } from 'tailwind-variants';

import { FieldError } from '~/components/ui/field-error';
import { Label } from '~/components/ui/label';
import { OtpInput } from '~/components/ui/otp-input';

const styles = tv({
  base: ['flex flex-col gap-y-4'],
});

interface OtpFieldProps extends _TextFieldProps {
  label?: string;
  className?: string;
  maxLength: number;
}

export function OtpField({
  label = 'Code',
  className,
  maxLength,
  ...props
}: OtpFieldProps) {
  return (
    <_TextField {...props} className={styles({ className })}>
      <div className="self-center">
        <Label className="font-semibold text-sm">{label}</Label>
        <OtpInput maxLength={maxLength} />
      </div>
      <FieldError className="text-center text-sm" />
    </_TextField>
  );
}
