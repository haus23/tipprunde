import { cn } from "cn";
import { composeRenderProps } from "react-aria-components";

/**
 * Merge a RAC render-prop className (string or function) with default Tailwind
 * classes. Consumer classes win via cn.
 */
export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (cls) => cn(tw, cls));
}
