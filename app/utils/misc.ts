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
