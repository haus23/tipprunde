import { data } from "react-router";

/**
 * Catch-all for unmatched public URLs. Throwing here gives the response a real
 * 404 status *and* routes the render through the layout's ErrorBoundary, so the
 * page keeps the site shell instead of falling through to the bare root boundary.
 */
export function loader() {
  throw data("Diese Seite existiert nicht.", { status: 404 });
}

export default function NotFound() {
  return null; // unreachable — the loader always throws
}
