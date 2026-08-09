export function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...val] = part.trim().split("=");
    if (key.trim() === name) return decodeURIComponent(val.join("="));
  }
  return null;
}

export function cookieHeader(
  name: string,
  value: string,
  options: { maxAge?: number } = {},
): string {
  const header = `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax`;
  return options.maxAge === undefined ? header : `${header}; Max-Age=${options.maxAge}`;
}

export function clearCookieHeader(name: string): string {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
