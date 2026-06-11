import { Input as AriaInput, type InputProps } from "react-aria-components";

import { composeTailwindRenderProps } from "#/lib/compose.ts";

const inputStyles =
  "border-subtle bg-surface text-app rounded-sm border px-2.5 py-1.5 text-sm outline-none transition ease-out data-focused:ring-2 data-focused:ring-accent/60";

export function Input({ className, ...props }: InputProps) {
  return <AriaInput className={composeTailwindRenderProps(className, inputStyles)} {...props} />;
}
