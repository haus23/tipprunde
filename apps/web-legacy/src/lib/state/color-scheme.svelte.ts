import { browser } from "$app/environment";

const schemes = ["system", "light", "dark"] as const;
type ColorScheme = (typeof schemes)[number];

const stored = browser ? localStorage.getItem("color-scheme") : null;
const initial: ColorScheme = schemes.includes(stored as ColorScheme)
  ? (stored as ColorScheme)
  : "system";

let current = $state<ColorScheme>(initial);

const effective = $derived<"light" | "dark">(
  current !== "system"
    ? current
    : browser && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
);

function apply() {
  if (!browser) return;
  localStorage.setItem("color-scheme", current);
  document.documentElement.setAttribute("data-color-scheme", current);
}

export function toggleScheme() {
  current = effective === "dark" ? "light" : "dark";
  apply();
}

export function resetScheme() {
  current = "system";
  apply();
}

export const colorScheme = {
  get current() {
    return current;
  },
  get effective() {
    return effective;
  },
};
