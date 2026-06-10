const base = process.env.WEB_APP_URL ?? "http://localhost:3000";

export function webAppUrl(path = "") {
  return `${base}${path}`;
}
