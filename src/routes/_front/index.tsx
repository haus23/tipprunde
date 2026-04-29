import { createFileRoute } from "@tanstack/react-router";

import { fetchIndexFn } from "#/app/front/index.tsx";

export const Route = createFileRoute("/_front/")({
  loader: () => fetchIndexFn(),
  head: () => ({
    meta: [{ title: "runde.tips" }, { name: "description", content: "Haus23 Fussball Tipprunde" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { Renderable } = Route.useLoaderData();
  return <>{Renderable}</>;
}
