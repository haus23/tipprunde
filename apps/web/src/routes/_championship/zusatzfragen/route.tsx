import { createFileRoute } from "@tanstack/react-router";

import { extraQuestionsQueryOptions } from "#/lib/extra-questions.ts";
import { pageTitle } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";

import { ZusatzfragenView } from "./-zusatzfragen-view.tsx";

export const Route = createFileRoute("/_championship/zusatzfragen")({
  loader: async ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      await Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(extraQuestionsQueryOptions(id)),
      ]);
    }
    return { championshipName: context.championship?.name };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: pageTitle("Zusatzfragen", loaderData?.championshipName) }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-3xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <ZusatzfragenView
      championshipId={championship.id}
      championshipName={championship.name}
      pointsPublished={championship.extraQuestionPointsPublished}
    />
  );
}
