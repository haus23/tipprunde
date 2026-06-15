import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Props {
  slug: string;
  children: ReactNode;
}

/** Links a player name to their Spieler view. */
export function PlayerLink({ slug, children }: Props) {
  return (
    <Link
      to="/spieler/{-$slug}"
      params={{ slug }}
      className="hover:text-accent focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
    >
      {children}
    </Link>
  );
}
