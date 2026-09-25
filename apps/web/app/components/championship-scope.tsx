import { createContext, useContext } from "react";

/**
 * URL prefix of the championship currently in scope — `""` for the running
 * one at "/", `"/turnier"` for it again at its forward-looking URL,
 * `"/turnier/<slug>"` for any other published one. See
 * docs/decisions/11-turnier-stadionsenf-routing.md.
 *
 * Set by whichever branch layout rendered the view. It exists so the shared
 * championship views can build links without knowing which branch they are
 * mounted under: the same file serves `/tabelle`, `/turnier/tabelle` and
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

/** The raw prefix — `""`, `/turnier`, or `/turnier/<slug>`. */
export function useChampionshipScope() {
  const basePath = useContext(ChampionshipScopeContext);
  if (basePath === null) {
    throw new Error("useChampionshipScope must be used inside a ChampionshipScopeProvider");
  }
  return { basePath };
}

/**
 * Builds a path inside the championship in scope:
 * `scoped("/tabelle")` → `/tabelle`, `/turnier/tabelle`, or
 * `/turnier/rr0304/tabelle`.
 */
export function useScopedPath() {
  const { basePath } = useChampionshipScope();
  return (path: string) => (path === "/" ? basePath || "/" : `${basePath}${path}`);
}

/** Leaf view segments every championship-scoped branch mounts under itself
 * (`championshipViews`/`overviewSiblingViews` in routes.ts) — needed here to
 * tell `/turnier/tabelle` (a view of the running championship) apart from
 * `/turnier/<slug>` (a championship whose slug happens to come right after
 * `/turnier`). A slug is never allowed to collide with one of these. */
const CHAMPIONSHIP_VIEW_SEGMENTS = [
  "tabelle",
  "spiele",
  "tipps",
  "verlauf",
  "zusatzfragen",
  "regelwerk",
];
const rootViewPattern = new RegExp(`^/(${CHAMPIONSHIP_VIEW_SEGMENTS.join("|")})(/|$)`);

/**
 * Derives the scope prefix from a pathname, for code that sits *above* the
 * provider: the public shell's nav renders on every page, including ones
 * outside any championship (/archiv, /stadionsenf, /login, the 404) where the
 * context does not exist, so it cannot use the hooks. Keeps the URL shape in
 * one place all the same.
 *
 * Returns `null` for "no championship scope" — distinct from `""`, which
 * means "the running championship, at its root URL". The public shell uses
 * `null` to hide the Tabelle/Spieler/Spiele sub-nav entirely outside any
 * championship, rather than falling back to the root championship's.
 */
export function championshipBasePath(pathname: string): string | null {
  if (pathname === "/" || rootViewPattern.test(pathname)) return "";

  const turnierMatch = /^\/turnier(?:\/([^/]+))?/.exec(pathname);
  if (turnierMatch) {
    const slug = turnierMatch[1];
    if (!slug || CHAMPIONSHIP_VIEW_SEGMENTS.includes(slug)) return "/turnier";
    return `/turnier/${slug}`;
  }

  return null;
}
