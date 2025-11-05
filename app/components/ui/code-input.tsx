import { OTPInput, REGEXP_ONLY_DIGITS, type OTPInputProps } from "input-otp";
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

export type CodeInputProps = Omit<OTPInputProps, "children" | "maxLength"> & {
  maxLength?: number;
};

export function CodeInput({
  className,
  pattern = REGEXP_ONLY_DIGITS,
  maxLength = 6,
  ...props
}: CodeInputProps) {
  return (
    <OTPInput
      maxLength={maxLength}
      pattern={pattern}
      containerClassName={containerClasses({ className })}
      {...props}
      render={({ slots }) => (
        <div className="flex gap-1">
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
