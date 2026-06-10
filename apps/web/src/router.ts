import { createRouter } from "@tanstack/react-router";

import type { ColorScheme, SessionUser } from "./lib/session.ts";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    context: {
      user: null as SessionUser | null,
      colorScheme: "system" as ColorScheme,
    },
  });

  return router;
}
