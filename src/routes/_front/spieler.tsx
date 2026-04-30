import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { fetchSpielerFn } from "#/app/front/spieler.tsx";

export const Route = createFileRoute("/_front/spieler")({
  validateSearch: v.object({ name: v.optional(v.string()) }),
  loaderDeps: ({ search: { name } }) => ({ name }),
  loader: ({ deps }) => fetchSpielerFn({ data: { name: deps.name } }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title ?? "Spieler" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { Renderable } = Route.useLoaderData();
  return <>{Renderable}</>;
}
