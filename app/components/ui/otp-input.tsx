import type { OTPInputProps as _OTPInputProps } from 'input-otp';

import { OTPInput as _OTPInput, REGEXP_ONLY_DIGITS } from 'input-otp';
import { useRef } from 'react';
import { InputContext, useContextProps } from 'react-aria-components';
import { tv } from 'tailwind-variants';

const containerStyles = tv({
  base: 'group flex items-center',
});

const slotStyles = tv({
  base: [
    'relative h-14 w-10 text-3xl',
    'flex items-center justify-center',
    'transition-all duration-300',
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

type OTPInputProps = Omit<_OTPInputProps, 'children'>;

export function OtpInput({ className, ...props }: OTPInputProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [mergedProps, mergedRef] = useContextProps(props, ref, InputContext);
  const { onChange, value, ...otpInputProps } = mergedProps;

  return (
    <_OTPInput
      ref={mergedRef}
      containerClassName={containerStyles({ className })}
      pattern={REGEXP_ONLY_DIGITS}
      {...otpInputProps}
      render={({ slots }) => (
        <div className="flex">
          {slots.map((slot, ix) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: No proper key available
            <div key={ix} className={slotStyles({ isActive: slot.isActive })}>
              <div className="tabular-nums group-has-[input[data-input-otp-placeholder-shown]]:opacity-20">
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
