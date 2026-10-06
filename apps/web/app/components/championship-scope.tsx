import { createContext, useContext } from "react";

/**
 * URL prefix of the championship currently in scope — `"/turnier"` for the
 * running one, `"/turnier/<slug>"` for any other published one. See
 * docs/decisions/11-turnier-routing-homepage.md.
 *
 * Set by whichever branch layout rendered the view. It exists so the shared
 * championship views can build links without knowing which branch they are
 * mounted under: the same file serves `/turnier/tabelle` and
 * `/turnier/rr0304/tabelle`.
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

/** The raw prefix — `/turnier` or `/turnier/<slug>`. */
export function useChampionshipScope() {
  const basePath = useContext(ChampionshipScopeContext);
  if (basePath === null) {
    throw new Error("useChampionshipScope must be used inside a ChampionshipScopeProvider");
  }
  return { basePath };
}

/**
 * Builds a path inside the championship in scope:
 * `scoped("/tabelle")` → `/turnier/tabelle` or `/turnier/rr0304/tabelle`,
 * `scoped("/")` → the championship's own overview.
 */
export function useScopedPath() {
  const { basePath } = useChampionshipScope();
  return (path: string) => (path === "/" ? basePath : `${basePath}${path}`);
}

/** Leaf view segments every championship branch mounts under itself
 * (`championshipViews`/`overviewSiblingViews` in routes.ts) — needed here to
 * tell `/turnier/tabelle` (a view of the running championship) apart from
 * `/turnier/<slug>`. A slug is never allowed to collide with one of these. */
const CHAMPIONSHIP_VIEW_SEGMENTS = [
  "tabelle",
  "spiele",
  "tipps",
  "verlauf",
  "zusatzfragen",
  "regelwerk",
];

/**
 * Derives the scope prefix from a pathname, for code that sits *above* the
 * provider: the public shell's nav renders on every page, including ones
 * outside any championship (/, /archiv, /login, the 404) where the context
 * does not exist, so it cannot use the hooks. Outside a championship it
 * falls back to the running one — the nav always leads somewhere.
 */
export function championshipBasePath(pathname: string): string {
  const slug = /^\/turnier\/([^/]+)/.exec(pathname)?.[1];
  return slug && !CHAMPIONSHIP_VIEW_SEGMENTS.includes(slug) ? `/turnier/${slug}` : "/turnier";
}
