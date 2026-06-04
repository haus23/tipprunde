import { useMatches } from "react-router";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: (string | false | null | undefined)[]) {
  return twMerge(...inputs);
}

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

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}
