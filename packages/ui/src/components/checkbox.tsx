import { CheckboxButton, CheckboxField, type CheckboxFieldProps } from "react-aria-components";

import { cx } from "#/lib/cva.ts";

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="group-data-selected:text-accent-fg size-3.5 text-transparent"
    >
      <path
        d="M5 12.5 L10 17.5 L19 7"
        stroke="currentColor"
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface Props extends CheckboxFieldProps {
  className?: string;
  /** Visible label. Omit and pass `aria-label` for a standalone box. */
  children?: React.ReactNode;
}

/**
 * `CheckboxButton` renders as the `<label>` for the hidden input — its
 * children ARE the label, box + text together. A separate `<Label>` next to
 * it double-labels the control (RAC Checkbox docs show only this shape, no
 * sibling `Label`).
 */
export function Checkbox({ className, children, ...props }: Props) {
  return (
    <CheckboxField {...props}>
      <CheckboxButton
        className={cx(
          "group inline-flex items-center gap-2 data-disabled:opacity-50",
          // Same press feedback and curve as Button — a tap that only changes a
          // colour reads as if nothing was registered, the more so now that the
          // hit area is larger than the box.
          "transition-transform ease-out data-pressed:scale-[0.97]",
          className,
        )}
      >
        <span className="border-subtle group-data-selected:border-accent group-data-selected:bg-accent group-data-focus-visible:ring-accent flex size-5 shrink-0 items-center justify-center rounded border transition-colors ease-out outline-none group-data-focus-visible:ring-2">
          <CheckMark />
        </span>
        {children && <span className="text-app select-none">{children}</span>}
      </CheckboxButton>
    </CheckboxField>
  );
}
