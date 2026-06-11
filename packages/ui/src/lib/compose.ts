import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";

/**
 * Merge a RAC render-prop className (string or function) with default Tailwind
 * classes. Consumer classes win via twMerge.
 */
export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string,
): string | ((v: T) => string) {
  return composeRenderProps(className, (cls) => twMerge(tw, cls));
}
