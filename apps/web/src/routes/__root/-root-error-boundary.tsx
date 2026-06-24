import { Link, type ErrorComponentProps } from "@tanstack/react-router";

import { RootDocument } from "./-root-document.tsx";

export function RootErrorBoundary({ error, reset }: ErrorComponentProps) {
  return (
    <RootDocument colorScheme="system">
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
        <h1 className="text-xl font-semibold">Etwas ist schiefgelaufen</h1>
        {import.meta.env.DEV && (
          <pre className="bg-surface-raised text-subtle max-w-xl overflow-auto rounded-md p-4 text-left text-xs">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )}
        <div className="flex gap-4 text-sm">
          <button
            type="button"
            onClick={reset}
            className="text-accent transition-colors hover:underline"
          >
            Erneut versuchen
          </button>
          <Link to="/" className="text-muted hover:text-app transition-colors">
            Zur Startseite
          </Link>
        </div>
      </div>
    </RootDocument>
  );
}
