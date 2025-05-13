import type { OTPInputProps as _OTPInputProps } from 'input-otp';
import type { VariantProps } from 'tailwind-variants';

import { OTPInput as _OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';
import { tv } from 'tailwind-variants';

const containerStyles = tv({
  base: 'group flex items-center justify-center',
});

const slotStyles = tv({
  base: [
    'relative h-14 w-10 text-3xl',
    'flex items-center justify-center',
    'border-app-6 border-y border-r first:rounded-l-md first:border-l last:rounded-r-md',
    'group-focus-within:border-accent-7 group-hover:border-accent-7',
    'outline-0 outline-accent-7/30',
  ],
  variants: {
    isActive: {
      true: 'outline-4',
    },
  },
});

type OTPInputProps = Omit<_OTPInputProps, 'maxLength' | 'children'> &
  VariantProps<typeof slotStyles>;

export function OtpInput({ className, isActive, ...props }: OTPInputProps) {
  return (
    <_OTPInput
      maxLength={6}
      containerClassName={containerStyles({ className })}
      pattern={REGEXP_ONLY_DIGITS}
      {...props}
      render={({ slots }) => (
        <div className="flex">
          {slots.map((slot, ix) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: No proper key available
            <div key={ix} className={slotStyles({ isActive: slot.isActive })}>
              <div className="group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
                {slot.char ?? slot.placeholderChar}
              </div>
              {slot.hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex animate-caret items-center justify-center">
                  <div className="h-8 w-px bg-app-12" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
}
