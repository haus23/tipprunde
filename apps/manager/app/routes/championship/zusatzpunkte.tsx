import { db } from "#/lib/db.server.ts";

import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/zusatzpunkte";

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const ruleset = await db.query.rulesets.findFirst({
    where: { id: championship.rulesetId },
    columns: { extraQuestionRuleId: true },
  });

  return { hasExtraQuestions: ruleset?.extraQuestionRuleId === "mit-zusatzfragen" };
}

export default function Zusatzpunkte({ loaderData }: Route.ComponentProps) {
  const { hasExtraQuestions } = loaderData;

  return (
    <div className="p-8">
      <div className="mb-6 flex min-h-9 items-center justify-between">
        <h1 className="text-xl font-semibold">Zusatzpunkte</h1>
      </div>
      <p className="text-subtle mt-8 text-center text-sm">
        {hasExtraQuestions
          ? "Noch keine Zusatzfragen festgelegt."
          : "Keine Zusatzfragen in diesem Turnier."}
      </p>
    </div>
  );
}
