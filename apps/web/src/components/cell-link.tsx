import { createLink } from "@tanstack/react-router";
import { Link as AriaLink, type LinkProps } from "react-aria-components";

interface Props extends Omit<LinkProps, "className"> {
  children: React.ReactNode;
}

/**
 * Links a table cell column to its navigation target.
 *
 * Affordance: hover devices highlight on hover; touch devices (no hover) get a
 * persistent underline so linked cells are recognizable. `data-pressed` gives
 * immediate tap feedback before the (sometimes slow) navigation starts.
 */
function Link(props: Props) {
  return (
    <AriaLink
      {...props}
      className="hover:text-accent data-pressed:bg-accent-subtle data-pressed:text-accent focus-visible:ring-accent rounded-sm p-1 transition-colors outline-none focus-visible:ring-2 [@media(hover:none)]:underline [@media(hover:none)]:underline-offset-2"
    />
  );
}

export const CellLink = createLink(Link);
