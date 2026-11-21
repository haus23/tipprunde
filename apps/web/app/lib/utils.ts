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
 * The Tipprunde's clock. Points in time (`rounds.starts_at`) are stored as
 * UTC ISO strings and only entered and shown in this zone — never in the
 * server's or the browser's own.
 */
export const APP_TIME_ZONE = "Europe/Berlin";

const dateTimeFormat = new Intl.DateTimeFormat("de-DE", {
  timeZone: APP_TIME_ZONE,
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

/** A UTC ISO instant in Berlin time: "Sa., 21.11.26, 15:30". */
export function formatDateTime(iso: string): string {
  return dateTimeFormat.format(new Date(iso));
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

/**
 * "Hinrunde 2008/09" → "HR 08/09", "Rückrunde 2007/08" → "RR 07/08"; the
 * tournaments ("EM 2008", "WM 2006") are short already. For narrow screens,
 * where the long half-season names would wrap.
 */
export function shortChampionshipName(name: string): string {
  const m = /^(Hin|Rück)runde \d{2}(\d{2})\/(\d{2})$/.exec(name);
  return m ? `${m[1] === "Hin" ? "HR" : "RR"} ${m[2]}/${m[3]}` : name;
}
