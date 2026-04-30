import { createFileRoute } from "@tanstack/react-router";
import * as v from "valibot";

import { fetchSpieleFn } from "#/app/front/spiele.tsx";

export const Route = createFileRoute("/_front/spiele")({
  validateSearch: v.object({ nr: v.optional(v.number()) }),
  loaderDeps: ({ search: { nr } }) => ({ nr }),
  loader: ({ deps }) => fetchSpieleFn({ data: { nr: deps.nr } }),
  head: ({ loaderData }) => ({
    meta: [{ title: loaderData?.title ?? "Spiele" }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { Renderable } = Route.useLoaderData();
  return <>{Renderable}</>;
}
