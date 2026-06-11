import { TextArea as AriaTextArea, type TextAreaProps } from "react-aria-components";

import { composeTailwindRenderProps } from "#/lib/compose.ts";

const textAreaStyles =
  "border-subtle bg-surface text-app resize-none rounded-sm border px-2.5 py-1.5 text-sm outline-none transition ease-out data-focused:ring-2 data-focused:ring-accent/60";

export function TextArea({ className, ...props }: TextAreaProps) {
  return (
    <AriaTextArea className={composeTailwindRenderProps(className, textAreaStyles)} {...props} />
  );
}
