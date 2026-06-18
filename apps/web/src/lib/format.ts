/** Joins non-empty parts with " · " and appends the site name. */
export function pageTitle(...parts: (string | null | undefined)[]) {
  return [...parts.filter(Boolean), "runde.tips"].join(" · ");
}

/** Short German date: "5. Mär" within the current year, else "05.03.25". */
export function formatDate(date: string) {
  const d = new Date(date);
  if (d.getFullYear() === new Date().getFullYear()) {
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short" });
  }
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
