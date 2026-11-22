/**
 * Just enough of a User-Agent parser for the session list on /konto: which
 * browser, which system, and whether it is a phone, a tablet or a computer.
 * Our own on purpose — `ua-parser-js` is AGPL from version 2 on, and the
 * Tipprunde's handful of devices does not need a library's thousand rules.
 * See docs/decisions/15-player-self-service.md.
 *
 * Order matters below: most browsers carry every older browser's token for
 * compatibility (Edge says "Chrome" and "Safari", Chrome says "Safari"), so
 * the specific ones are checked before the generic ones.
 */

export type DeviceKind = "phone" | "tablet" | "computer";

export type ParsedUserAgent = {
  browser: string | null;
  os: string | null;
  kind: DeviceKind;
};

const BROWSERS: [RegExp, string][] = [
  [/Edg(A|iOS)?\//, "Edge"],
  [/SamsungBrowser\//, "Samsung Internet"],
  [/OPR\/|Opera/, "Opera"],
  [/Firefox\/|FxiOS\//, "Firefox"],
  [/Chrome\/|CriOS\//, "Chrome"],
  [/Version\/[\d.]+.*Safari\//, "Safari"],
];

const SYSTEMS: [RegExp, string][] = [
  [/iPhone/, "iOS"],
  [/iPad/, "iPadOS"],
  [/Android/, "Android"],
  [/Windows/, "Windows"],
  [/CrOS/, "ChromeOS"],
  // After iPhone/iPad: an iPad in desktop mode announces itself as a Mac, and
  // nothing in the header tells the two apart — it shows as macOS.
  [/Macintosh|Mac OS X/, "macOS"],
  [/Linux/, "Linux"],
];

export function parseUserAgent(ua: string | null): ParsedUserAgent {
  if (!ua) return { browser: null, os: null, kind: "computer" };
  const browser = BROWSERS.find(([re]) => re.test(ua))?.[1] ?? null;
  const os = SYSTEMS.find(([re]) => re.test(ua))?.[1] ?? null;
  const kind: DeviceKind =
    /iPhone/.test(ua) || (/Android/.test(ua) && /Mobile/.test(ua))
      ? "phone"
      : /iPad|Android/.test(ua)
        ? "tablet"
        : "computer";
  return { browser, os, kind };
}

/** "Chrome auf macOS", "Safari auf iOS" — or "Unbekanntes Gerät". */
export function describeUserAgent({ browser, os }: ParsedUserAgent): string {
  if (browser && os) return `${browser} auf ${os}`;
  return browser ?? os ?? "Unbekanntes Gerät";
}
