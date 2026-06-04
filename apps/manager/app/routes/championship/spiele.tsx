import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "react-aria-components";

import { db } from "#/lib/db.server.ts";
import { cn } from "#/lib/utils.ts";

import { championshipContext } from "../../lib/context";
import type { Route } from "./+types/spiele";

export const handle = { title: "Spiele" };

export async function loader({ context }: Route.LoaderArgs) {
  const championship = context.get(championshipContext);
  const firstRound = await db.query.rounds.findFirst({
    where: { championshipId: championship.id },
  });
  return { hasRounds: !!firstRound, championshipName: championship.name };
}

export default function Spiele({ loaderData }: Route.ComponentProps) {
  const { hasRounds, championshipName } = loaderData;
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-8">
      <title>{`Spiele | ${championshipName}`}</title>
      <div className="mb-6 flex min-h-9 items-center justify-between">
        <div />
        <Button
          onPress={() => setIsCreateOpen(true)}
          className={cn(
            "bg-btn text-btn flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "hover:bg-btn-hover",
            "data-focused:outline-none data-focused:ring-2 data-focused:ring-accent",
          )}
        >
          <PlusIcon className="size-4" />
          Neue Runde
        </Button>
      </div>

      {!hasRounds && (
        <p className="text-subtle mt-8 text-center text-sm">Noch keine Runden angelegt.</p>
      )}

      {/* RundeDialog goes here */}
    </div>
  );
}
