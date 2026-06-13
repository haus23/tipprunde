import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

interface Props {
  nr: number;
  children: ReactNode;
}

/** Links a match cell (number or pairing) to its single-match view. */
export function MatchLink({ nr, children }: Props) {
  return (
    <Link
      to="/spiele/$nr"
      params={{ nr: String(nr) }}
      className="hover:text-accent focus-visible:ring-accent rounded-sm transition-colors outline-none focus-visible:ring-2"
    >
      {children}
    </Link>
  );
}
