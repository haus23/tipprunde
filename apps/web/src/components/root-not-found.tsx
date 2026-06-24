import { Link } from "@tanstack/react-router";

export function RootNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-xl font-semibold">Seite nicht gefunden</h1>
      <p className="text-subtle text-sm">Diese Seite existiert nicht.</p>
      <Link to="/" className="text-accent text-sm transition-colors hover:underline">
        Zur Startseite
      </Link>
    </div>
  );
}
