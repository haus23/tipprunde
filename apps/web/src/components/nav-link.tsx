import { Link } from "@tanstack/react-router";

export function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <div className="has-aria-[current=page]:border-accent flex h-full items-center border-b-2 border-transparent">
      <Link
        to={to}
        activeProps={{ "aria-current": "page", className: "text-app" }}
        inactiveProps={{ className: "text-muted" }}
        className="focus-visible:ring-accent hover:bg-nav-active hover:text-app rounded-sm px-3 py-1.5 text-sm font-medium transition ease-out outline-none focus-visible:ring-2"
      >
        {children}
      </Link>
    </div>
  );
}
