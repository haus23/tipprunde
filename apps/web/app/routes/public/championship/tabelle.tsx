import { redirect } from "react-router";

import type { Route } from "./+types/tabelle";

/**
 * The table used to live here; it is the championship's own page now
 * (`/turnier` and `/turnier/:slug`). Kept as a permanent redirect so shared
 * and bookmarked links keep working — see
 * docs/decisions/14-turnier-tabelle-stadionsenf.md.
 *
 * `url`, not `request.url`: the latter keeps the `.data` suffix on client
 * navigations and would redirect to `/turnier.data`.
 */
export function loader({ url }: Route.LoaderArgs) {
  throw redirect(`${url.pathname.replace(/\/tabelle\/?$/, "")}${url.search}`, 301);
}
