import { createFileRoute } from "@tanstack/react-router";

import { SpieleView } from "#/components/spiele-view.tsx";
import { pageTitle } from "#/lib/format.ts";
import { roundsQueryOptions } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/spiele/")({
  loader: async ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      await context.queryClient.ensureQueryData(roundsQueryOptions(id));
    }
    return { championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle("Spiele", loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return <SpieleView championshipId={championship.id} championshipName={championship.name} />;
}
