import { OTPInput, REGEXP_ONLY_DIGITS, type OTPInputProps } from "input-otp";
import { InputContext, useContextProps } from "react-aria-components";
import { cva } from "~/utils/cva";

const containerClasses = cva({ base: "group flex items-center" });
const slotClasses = cva({
  base: [
    "relative flex items-center justify-center",
    "h-14 w-10 text-3xl",
    "border border-default rounded-sm",
    "bg-raised text-primary",
  ],
  variants: {
    isActive: {
      true: "outline-none ring-2 ring-focus",
    },
  },
});

export type CodeInputProps = Omit<OTPInputProps, "children" | "maxLength"> & {
  maxLength?: number;
  ref?: React.RefObject<HTMLInputElement | null>;
  onChange?: () => void;
};

export function CodeInput({
  className,
  ref,
  onChange,
  ...localProps
}: CodeInputProps) {
  const [mergedProps, mergedRef] = useContextProps(
    { ...localProps },
    ref,
    InputContext,
  );

  // Set defaults and omit controlled input props
  const {
    maxLength,
    minLength,
    pattern,
    value: _value,
    onComplete,
    ...props
  } = mergedProps;

  return (
    <OTPInput
      maxLength={maxLength ?? 6}
      minLength={minLength ?? maxLength ?? 6}
      pattern={pattern ?? REGEXP_ONLY_DIGITS}
      ref={mergedRef}
      containerClassName={containerClasses({ className })}
      {...props}
      onChange={(value) => {
        onChange?.();
        if (value.length === (maxLength ?? 6)) {
          onComplete?.();
        }
      }}
      render={({ slots }) => (
        <div className="flex gap-1.5">
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
