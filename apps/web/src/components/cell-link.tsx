import { createLink } from "@tanstack/react-router";
import { Link as AriaLink, type LinkProps } from "react-aria-components";

interface Props extends Omit<LinkProps, "className"> {
  children: React.ReactNode;
}

/** Links a table cell column to its navigation target. */
function Link(props: Props) {
  return (
    <AriaLink
      {...props}
      className="hover:text-accent focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
    />
  );
}

export const CellLink = createLink(Link);
