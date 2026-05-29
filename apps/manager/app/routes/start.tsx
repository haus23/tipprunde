import { Link } from "react-router";

import { Card, CardContent } from "#/components/card.tsx";
import { db } from "#/lib/db.server.ts";

import type { Route } from "./+types/start";

export async function loader(_: Route.LoaderArgs) {
  const hasRulesets = !!(await db.query.rulesets.findFirst());
  return { hasRulesets };
}

export default function Start({ loaderData }: Route.ComponentProps) {
  const { hasRulesets } = loaderData;

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {hasRulesets ? (
          <Card>
            <CardContent>
              <p className="text-lg font-medium">Fast geschafft!</p>
              <p className="text-subtle mt-3 text-sm">
                Das Regelwerk steht. Jetzt fehlt nur noch dein erstes Turnier — dann kann die
                Tipprunde beginnen.
              </p>
              <Link
                to="/turniere"
                className="bg-btn text-btn hover:bg-btn-hover mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Erstes Turnier anlegen →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <p className="text-lg font-medium">Hallo, schön dass du da bist!</p>
              <p className="text-subtle mt-3 text-sm">
                Starte deine erste Tipprunde — dein erstes Tippturnier wartet schon auf dich.
              </p>
              <p className="text-subtle mt-2 text-sm">
                Bevor es losgeht, brauchen wir ein Regelwerk: es legt fest, wie Punkte vergeben
                werden, ob es Joker gibt und was sonst noch bei deinem Turnier gelten soll.
              </p>
              <Link
                to="/regelwerke"
                className="bg-btn text-btn hover:bg-btn-hover mt-4 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
              >
                Hier geht's lang →
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
