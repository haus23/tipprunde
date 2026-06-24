import { Link } from "@tanstack/react-router";

export function SectionLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-subtle hover:text-app focus-visible:ring-accent rounded-sm p-1 text-xs transition-colors outline-none focus-visible:ring-2"
    >
      {children}
    </Link>
  );
}
