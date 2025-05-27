import { useEffect, useState } from 'react';
import slugifyFn from 'slugify';

const MOBILE_BREAKPOINT = 768; // md (medium) breakpoint in TailwindCSS

/**
 * Hook watching my mobile breakpoint
 *
 * @returns true if screen width is mobile
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener('change', onChange, { passive: true });
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return !!isMobile;
}

/**
 * Combine multiple header objects into one (uses append so headers are not overridden)
 *
 * @param headers Params containing source headers
 * @returns Combined headers object
 */
export function combineHeaders(
  ...headers: Array<ResponseInit['headers'] | null | undefined>
) {
  const combined = new Headers();
  for (const header of headers) {
    if (!header) continue;
    for (const [key, value] of new Headers(header).entries()) {
      combined.append(key, value);
    }
  }
  return combined;
}

/**
 * Constructs and returns the full domain URL based on the request headers
 * or URL.
 *
 * @param request - Request object to extract domain and protocol information.
 * @return The full domain URL including protocol and host.
 */
export function getDomainUrl(request: Request) {
  const host =
    request.headers.get('X-Forwarded-Host') ??
    request.headers.get('host') ??
    new URL(request.url).host;
  const protocol = request.headers.get('X-Forwarded-Proto') ?? 'http';
  return `${protocol}://${host}`;
}

/**
 * Helper to handle readonly arrays
 * See: https://fettblog.eu/typescript-array-includes/
 *
 * @param array Readonly array of values
 * @param el Value to test
 * @returns true if el was found in coll
 */
export function includes<T extends U, U>(
  array: ReadonlyArray<T>,
  el: U,
): el is T {
  return array.includes(el as T);
}

/**
 * Helper to slug string values
 *
 * @param str Original string value
 * @returns Slugified string
 */
export function slugify(str: string) {
  return slugifyFn(str, { locale: 'de', lower: true });
}
