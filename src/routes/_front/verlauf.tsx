import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { inArray } from "drizzle-orm";

import { PunkteverlaufChart } from "#/components/punkteverlauf-chart.tsx";
import { computeRanking } from "#/domain/ranking.ts";
import { db } from "#db";
import { getLatestPublishedChampionship } from "#db/dal/championships.ts";
import { getPlayers } from "#db/dal/players.ts";
import { tips } from "#db/schema/tables.ts";

const fetchVerlaufFn = createServerFn({ method: "GET" }).handler(async () => {
  const championship = await getLatestPublishedChampionship();
  if (!championship) return null;

  const allPlayers = await getPlayers(championship.id);

  const roundIds = (
    await db.query.rounds.findMany({
      where: { championshipId: championship.id, published: true },
      columns: { id: true },
    })
  ).map((r) => r.id);

  const allMatches =
    roundIds.length > 0
      ? await db.query.matches.findMany({
          where: { roundId: { in: roundIds }, result: { isNotNull: true } },
          columns: { id: true, nr: true },
          orderBy: { nr: "asc" },
        })
      : [];

  const matchIds = allMatches.map((m) => m.id);

  const allTips =
    matchIds.length > 0
      ? await db
          .select({ matchId: tips.matchId, userId: tips.userId, points: tips.points })
          .from(tips)
          .where(inArray(tips.matchId, matchIds))
      : [];

  const players = allPlayers.map((p) => ({
    userId: p.userId,
    name: p.user?.name ?? "",
  }));

  // Accumulate points match by match and snapshot ranking after each
  const cumulative = new Map<number, number>(players.map((p) => [p.userId, 0]));

  const snapshots = allMatches.map((match) => {
    allTips
      .filter((t) => t.matchId === match.id)
      .forEach((t) => {
        cumulative.set(t.userId, (cumulative.get(t.userId) ?? 0) + (t.points ?? 0));
      });

    const ranked = computeRanking(
      players.map((p) => ({ userId: p.userId, points: cumulative.get(p.userId) ?? 0 })),
    );

    return {
      matchNr: match.nr,
      entries: ranked.map((r) => ({ userId: r.userId, points: r.points, rank: r.rank })),
    };
  });

  // Sort players by final ranking
  const finalSnapshot = snapshots.at(-1);
  const sortedPlayers = [...players].sort((a, b) => {
    const ra = finalSnapshot?.entries.find((e) => e.userId === a.userId)?.rank ?? 999;
    const rb = finalSnapshot?.entries.find((e) => e.userId === b.userId)?.rank ?? 999;
    return ra - rb;
  });

  return { championshipName: championship.name, sortedPlayers, snapshots };
});

export const Route = createFileRoute("/_front/verlauf")({
  loader: () => fetchVerlaufFn(),
  component: VerlaufComponent,
});

function VerlaufComponent() {
  const data = Route.useLoaderData();

  if (!data) return <p className="p-4">Kein aktives Turnier.</p>;

  const { championshipName, sortedPlayers, snapshots } = data;

  return (
    <div className="xs:px-4 mx-auto w-full max-w-5xl py-8">
      <div className="xs:px-0 mb-6 flex flex-col gap-2 px-4">
        <h1 className="text-2xl font-semibold tracking-tight">{championshipName}</h1>
        <p className="text-subtle text-sm">Punkteverlauf</p>
      </div>
      <PunkteverlaufChart players={sortedPlayers} snapshots={snapshots} />
    </div>
  );
}
