import { cva } from "cva";
import { OTPInput, REGEXP_ONLY_DIGITS, type OTPInputProps } from "input-otp";

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

export type OtpInputProps = Omit<OTPInputProps, "children">;

export function OtpInput({
  className,
  pattern = REGEXP_ONLY_DIGITS,
  ...props
}: OtpInputProps) {
  return (
    <OTPInput
      containerClassName={containerClasses({ className })}
      pattern={pattern}
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
