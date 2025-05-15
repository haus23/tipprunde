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
