import { Outlet } from "react-router";

import { ManagerErrorContent } from "./_error-content.tsx";

/**
 * Pathless layout whose only job is to carry an ErrorBoundary for the manager's
 * own pages, so an error there keeps the sidebar and championship switcher.
 *
 * It cannot live on `manager/_layout.tsx`: a layout's own boundary *replaces*
 * that layout, which would throw away exactly the chrome worth keeping.
 * Replacing this one costs nothing — it renders its outlet and nothing else.
 *
 * The championship subtree and the `/manager/*` catch-all bring their own.
 */
export const ErrorBoundary = ManagerErrorContent;

export default function ManagerPages() {
  return <Outlet />;
}
