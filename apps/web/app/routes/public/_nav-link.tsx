import { cx } from "@tipprunde/ui";
import { Link } from "react-router";

/**
 * Top-nav item for the public shell — underlined via the wrapper's bottom
 * border (the transparent top one keeps the link centered with its
 * neighbours). Active state comes from the shell, not from URL matching here:
 * the table's item points at the championship's root, a prefix of every other
 * view, and still has to stay lit on its own Verlauf and Regelwerk tabs.
 */
export function PublicNavLink({
  to,
  isActive,
  children,
}: {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="has-aria-[current=page]:border-b-accent flex h-full items-center border-y-2 border-transparent">
      <Link
        to={to}
        prefetch="intent"
        aria-current={isActive ? "page" : undefined}
        className={cx(
          "focus-visible:ring-accent hover:bg-nav-active hover:text-app xs:px-3 rounded-sm px-2 py-1.5 text-sm font-medium transition ease-out outline-none focus-visible:ring-2",
          isActive ? "text-app" : "text-muted",
        )}
      >
        {children}
      </Link>
    </div>
  );
}
