import { Link as AriaLink, type LinkProps } from "react-aria-components";

interface Props extends Omit<LinkProps, "className"> {
  children: React.ReactNode;
}

/**
 * The app's inline text link — in a table cell, in a heading, in prose.
 *
 * Affordance: hover devices highlight on hover; touch devices (no hover) get a
 * persistent underline so linked text is recognizable. `data-pressed` gives
 * immediate tap feedback before the (sometimes slow) navigation starts.
 *
 * Client-side routing comes from the RAC RouterProvider wired up in root.
 */
export function AppLink(props: Props) {
  return (
    <AriaLink
      {...props}
      className="hover:text-accent data-pressed:bg-accent-subtle data-pressed:text-accent focus-visible:ring-accent rounded-sm p-1 transition-colors outline-none focus-visible:ring-2 [@media(hover:none)]:underline [@media(hover:none)]:underline-offset-2"
    />
  );
}
