import { cx } from "@tipprunde/ui";
import { NavLink } from "react-router";

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cx(
    "rounded-sm px-3 py-1.5 text-sm transition-colors outline-none",
    "hover:bg-nav-active focus-visible:ring-accent focus-visible:ring-2",
    isActive ? "text-app font-medium" : "text-muted hover:text-app",
  );

/** Horizontal sub-nav between an Archiv championship's views. */
export function ArchivSubNav({ slug }: { slug: string }) {
  return (
    <nav className="flex items-center gap-1">
      <NavLink to={`/archiv/${slug}`} end prefetch="intent" className={linkClass}>
        Abschlusstabelle
      </NavLink>
      <NavLink to={`/archiv/${slug}/regelwerk`} prefetch="intent" className={linkClass}>
        Regelwerk
      </NavLink>
    </nav>
  );
}
