import { Link, isRouteErrorResponse, useRouteError } from "react-router";

/**
 * Error content for routes *below* the manager layout, so the sidebar and
 * header stay put — the manager equivalent of the public layout's boundary.
 * Mounted as the `ErrorBoundary` of a child route, never of the layout itself
 * (a layout-level boundary would replace the shell it is meant to preserve).
 */
export function ManagerErrorContent() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
      {/* The replaced route component would have rendered the document title. */}
      <title>{isNotFound ? "Nicht gefunden | Manager" : "Fehler | Manager"}</title>
      <h1 className="text-xl font-semibold">
        {isNotFound ? "Seite nicht gefunden" : "Etwas ist schiefgelaufen"}
      </h1>
      <p className="text-subtle text-sm">
        {isNotFound ? "Diese Seite existiert nicht." : "Bitte versuche es später noch einmal."}
      </p>
      {/* Never leak internals — details stay a dev affordance. */}
      {import.meta.env.DEV && !isNotFound && (
        <pre className="bg-surface-raised text-subtle max-w-xl overflow-auto rounded-md p-4 text-left text-xs">
          {error instanceof Error ? (error.stack ?? error.message) : String(error)}
        </pre>
      )}
      <Link to="/manager" className="text-accent text-sm transition-colors hover:underline">
        Zur Manager-Startseite
      </Link>
    </div>
  );
}
