import { OTPInput, REGEXP_ONLY_DIGITS, type OTPInputProps } from "input-otp";
import { InputContext, useContextProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const containerClasses = cva({ base: "group flex items-center" });
const slotClasses = cva({
  base: [
    "relative flex items-center justify-center",
    "h-14 w-10 text-3xl",
    "border rounded-xs",
  ],
  variants: {
    isActive: {
      true: "[outline:auto]",
    },
  },
});

export type OtpInputProps = Omit<OTPInputProps, "children" | "maxLength"> & {
  maxLength?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
};

export function OtpInput({
  className,
  pattern = REGEXP_ONLY_DIGITS,
  maxLength = 6,
  ref,
  ...localProps
}: OtpInputProps) {
  const [mergedProps, mergedRef] = useContextProps(
    { ...localProps, maxLength, pattern },
    ref,
    InputContext,
  );

  // Omit controlled input props
  const { value: _value, onChange: _onChange, ...props } = mergedProps;

  return (
    <OTPInput
      ref={mergedRef}
      containerClassName={containerClasses({ className })}
      {...props}
      render={({ slots }) => (
        <div className="flex">
          {slots.map((slot, ix) => (
            <div key={ix} className={slotClasses({ isActive: slot.isActive })}>
              <div className="tabular-nums">
                {slot.char ?? slot.placeholderChar}
              </div>
              {slot.hasFakeCaret && (
                <div className="pointer-events-none absolute inset-0 flex animate-caret items-center justify-center">
                  <div className="h-7 w-px border" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    />
  );
}
