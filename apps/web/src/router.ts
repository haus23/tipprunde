import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      // App data is mutated by the manager app (separate deployment) and is
      // never real-time — serve from cache for 10 min so cross-route navigation
      // doesn't re-hit the DB. Override per-query if some data needs to be fresher.
      queries: { staleTime: 10 * 60 * 1000 },
    },
  });

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    // Warm a route's loader on intent — on touch this fires at touchstart, so the
    // (slow) Turso query is already in flight before the tap completes. RQ owns
    // caching, so preloadStaleTime stays 0 to defer to the query's staleTime.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    context: { queryClient },
  });

  setupRouterSsrQueryIntegration({ router, queryClient });

  return router;
}
