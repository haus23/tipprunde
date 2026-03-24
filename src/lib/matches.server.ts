import { createServerOnlyFn } from "@tanstack/react-start";
import { eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { matches } from "@/lib/db/schema.ts";

interface MatchInput {
  roundId: number;
  date: string | null;
  leagueId: string | null;
  hometeamId: string | null;
  awayteamId: string | null;
  result: string | null;
}

interface UpdateMatchInput extends Omit<MatchInput, "roundId"> {
  id: number;
}

export const getMatchesForRound = createServerOnlyFn(async (roundId: number) =>
  db.query.matches.findMany({
    where: { roundId },
    orderBy: { nr: "asc" },
  }),
);

export const createMatch = createServerOnlyFn(async (data: MatchInput) => {
  const [row] = await db
    .select({ maxNr: max(matches.nr) })
    .from(matches)
    .where(eq(matches.roundId, data.roundId));
  const nr = (row?.maxNr ?? 0) + 1;
  return db.insert(matches).values({ ...data, nr });
});

export const updateMatch = createServerOnlyFn(async ({ id, ...data }: UpdateMatchInput) =>
  db.update(matches).set(data).where(eq(matches.id, id)),
);

export const deleteMatch = createServerOnlyFn(async (id: number) =>
  db.delete(matches).where(eq(matches.id, id)),
);
