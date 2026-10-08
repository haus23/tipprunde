import { cx } from "@tipprunde/ui";
import { NavLink } from "react-router";

/** Top-nav item for the public shell — underlined via the wrapper's bottom border (the transparent top one keeps the link centered with its neighbours). */
export function PublicNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div className="has-aria-[current=page]:border-b-accent flex h-full items-center border-y-2 border-transparent">
      <NavLink
        to={to}
        prefetch="intent"
        className={({ isActive }) =>
          cx(
            "focus-visible:ring-accent hover:bg-nav-active hover:text-app rounded-sm px-3 py-1.5 text-sm font-medium transition ease-out outline-none focus-visible:ring-2",
            isActive ? "text-app" : "text-muted",
          )
        }
      >
        {children}
      </NavLink>
    </div>
  );
}
