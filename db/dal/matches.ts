import { createServerOnlyFn } from "@tanstack/react-start";
import { eq, max } from "drizzle-orm";
import { db } from "#db";
import { matches } from "../schema/tables.ts";

export const getMatches = createServerOnlyFn(async (roundId: number) =>
  db.query.matches.findMany({
    where: { roundId },
    orderBy: { nr: "asc" },
  }),
);

export const createMatch = createServerOnlyFn(
  async (data: Omit<typeof matches.$inferInsert, "id" | "nr">) => {
    const [result] = await db
      .select({ maxNr: max(matches.nr) })
      .from(matches)
      .where(eq(matches.roundId, data.roundId));
    const nr = (result.maxNr ?? 0) + 1;
    return db.insert(matches).values({ ...data, nr });
  },
);

export const updateMatch = createServerOnlyFn(
  async (data: Partial<typeof matches.$inferInsert> & { id: number }) => {
    const { id, ...rest } = data;
    return db.update(matches).set(rest).where(eq(matches.id, id));
  },
);
