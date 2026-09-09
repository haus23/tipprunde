import { useMatches } from "react-router";

function getPageTitle(matches: { handle: unknown }[]): string | undefined {
  return matches.findLast(
    (m): m is typeof m & { handle: { title: string } } =>
      !!m.handle &&
      typeof m.handle === "object" &&
      "title" in m.handle &&
      typeof m.handle.title === "string",
  )?.handle.title;
}

export function usePageTitle(): string | undefined {
  return getPageTitle(useMatches());
}

export function formatDate(date: string) {
  const d = new Date(date);
  if (d.getFullYear() === new Date().getFullYear()) {
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
}

/**
 * Point values in German notation. Only extra-question points are ever
 * fractional, and always in halves — so a single decimal is enough, and
 * whole numbers stay free of a pointless ",0".
 */
export function formatPoints(points: number): string {
  return (Number.isInteger(points) ? String(points) : points.toFixed(1)).replace(".", ",");
}

/**
 * Per-match averages in German notation. Unlike points these keep both
 * decimals even when round — an average of exactly "2,00" reads as measured,
 * "2" reads as counted.
 */
export function formatAverage(value: number): string {
  return value.toFixed(2).replace(".", ",");
}

/**
 * Compares German text the way a dictionary would, not by UTF-16 code point.
 * SQLite's `ORDER BY` sorts by code point, which puts every umlaut in the
 * wrong place — "Ö" is U+00D6, past "Z" at U+005A, so "Österreich" sorts
 * after "Zypern" instead of near "Osterhase". `Intl.Collator` with the
 * German locale fixes ordering for umlauts, `ß`, and case at once.
 */
const germanCollator = new Intl.Collator("de-DE");

/**
 * Sorts a fetched list by a German-language field. Sorted in JS, after the
 * query, rather than in SQL: these are master-data lists (teams, players,
 * rulesets — a few hundred rows at most), so the cost is nil and correct
 * German collation only exists in JS here, not in SQLite.
 */
export function sortGerman<T>(items: T[], key: (item: T) => string): T[] {
  return items.toSorted((a, b) => germanCollator.compare(key(a), key(b)));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
