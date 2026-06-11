import {
  CheckboxButton,
  CheckboxField,
  type CheckboxFieldProps,
  Label,
} from "react-aria-components";

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

export function Checkbox({ className, children, ...props }: Props) {
  return (
    <CheckboxField
      className={cx("inline-flex items-center gap-2 data-disabled:opacity-50", className)}
      {...props}
    >
      <CheckboxButton className="group border-subtle data-selected:border-accent data-selected:bg-accent data-focus-visible:ring-accent flex size-5 items-center justify-center rounded border transition-colors outline-none data-focus-visible:ring-2">
        <CheckMark />
      </CheckboxButton>
      {children && <Label className="text-app select-none">{children}</Label>}
    </CheckboxField>
  );
}
