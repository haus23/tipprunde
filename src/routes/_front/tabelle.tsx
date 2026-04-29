import { createFileRoute } from "@tanstack/react-router";

import { fetchTabelleFn } from "#/app/front/tabelle.tsx";

export const Route = createFileRoute("/_front/tabelle")({
  loader: () => fetchTabelleFn(),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title ?? "Tabelle" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { Renderable } = Route.useLoaderData();
  return <>{Renderable}</>;
}
