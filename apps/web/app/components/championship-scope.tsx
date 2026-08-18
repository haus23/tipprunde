import { createContext, useContext } from "react";

/**
 * URL prefix of the championship currently in scope — `""` for the running one,
 * `"/archiv/<slug>"` for an archived one.
 *
 * Set by whichever branch layout rendered the view. It exists so the shared
 * championship views can build links without knowing which branch they are
 * mounted under: the same file serves `/tabelle` and `/archiv/rr0304/tabelle`.
 */
const ChampionshipScopeContext = createContext<string | null>(null);

export function ChampionshipScopeProvider({
  basePath,
  children,
}: {
  basePath: string;
  children: React.ReactNode;
}) {
  return (
    <ChampionshipScopeContext.Provider value={basePath}>
      {children}
    </ChampionshipScopeContext.Provider>
  );
}

/** The raw prefix — `""` for the running championship, `/archiv/<slug>` otherwise. */
export function useChampionshipScope() {
  const basePath = useContext(ChampionshipScopeContext);
  if (basePath === null) {
    throw new Error("useChampionshipScope must be used inside a ChampionshipScopeProvider");
  }
  return { basePath, isArchived: basePath !== "" };
}

/**
 * Builds a path inside the championship in scope:
 * `scoped("/tabelle")` → `/tabelle` or `/archiv/rr0304/tabelle`.
 */
export function useScopedPath() {
  const { basePath } = useChampionshipScope();
  return (path: string) => (path === "/" ? basePath || "/" : `${basePath}${path}`);
}

/**
 * Derives the scope prefix from a pathname, for code that sits *above* the
 * provider: the public shell's nav renders on pages outside any championship
 * (/archiv, /login, the 404) where the context does not exist, so it cannot use
 * the hooks. Keeps the URL shape in one place all the same.
 */
export function championshipBasePath(pathname: string): string {
  const match = pathname.match(/^\/archiv\/([^/]+)/);
  return match ? `/archiv/${match[1]}` : "";
}
