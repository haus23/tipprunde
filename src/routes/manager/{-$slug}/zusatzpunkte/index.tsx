import { createFileRoute } from "@tanstack/react-router";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import type { ExtraQuestionRuleId } from "#/domain/rules.ts";

export const Route = createFileRoute("/manager/{-$slug}/zusatzpunkte/")({
  beforeLoad: () => ({ pageTitle: "Zusatzpunkte" }),
  loader: async ({ context: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    return { championship };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `Zusatzpunkte | ${loaderData?.championship?.name}` }],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship } = Route.useLoaderData();

  const extraQuestionRuleId =
    (championship?.ruleset?.extraQuestionRuleId as ExtraQuestionRuleId | null) ?? null;

  if (extraQuestionRuleId === "keine-besonderheiten") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-medium md:hidden">Zusatzpunkte</h1>
        <p className="text-subtle text-sm">In diesem Turnier gibt es keine Zusatzpunkte.</p>
      </div>
    );
  }

  return null;
}
