const base = process.env.WEB_APP_URL ?? "http://localhost:5173";

export function webAppUrl(path = "") {
  return `${base}${path}`;
}
