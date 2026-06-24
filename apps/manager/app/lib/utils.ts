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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
