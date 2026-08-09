export const COLOR_SCHEMES = ["light", "dark", "system"] as const;

export type ColorScheme = (typeof COLOR_SCHEMES)[number];

export const COLOR_SCHEME_COOKIE = "__color-scheme";

/** "system" is the default and is stored as *absence* of the cookie. */
export const COLOR_SCHEME_MAX_AGE = 60 * 60 * 24 * 365;
