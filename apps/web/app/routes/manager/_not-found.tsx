import { data } from "react-router";

import { ManagerErrorContent } from "./_error-content.tsx";

/**
 * Catch-all for unmatched `/manager/*` URLs. More specific than the public
 * splat, so manager typos keep the manager shell instead of falling through
 * to the public 404. Throwing gives the response a real 404 status and hands
 * the render to the boundary below, which sits inside the layout's outlet.
 */
export function loader() {
  throw data(null, { status: 404 });
}

export const ErrorBoundary = ManagerErrorContent;

export default function ManagerNotFound() {
  return null; // unreachable — the loader always throws
}
