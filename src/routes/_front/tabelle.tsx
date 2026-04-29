import { createFileRoute } from "@tanstack/react-router";

import { fetchCurrentChampionshipFn } from "#/app/front/championships.ts";
import { fetchRankingFn } from "#/app/front/ranking.ts";

export const Route = createFileRoute("/_front/tabelle")({
  loader: async () => {
    const championship = await fetchCurrentChampionshipFn();
    if (!championship) return { championship: null, ranking: [] };
    const ranking = await fetchRankingFn({ data: championship.id });
    return { championship, ranking };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.championship ? `Tabelle | ${loaderData.championship.name}` : "Tabelle" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, ranking } = Route.useLoaderData();

  if (!championship) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-2 py-24 text-center">
        <p className="text-subtle text-sm">Noch kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">{championship.name}</h1>
      <div className="bg-surface border-surface rounded-md border px-4 py-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-input border-b text-left">
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
                #
              </th>
              <th className="text-subtle px-2 pt-2 pb-3 text-xs font-medium tracking-wide uppercase">
                Spieler
              </th>
              <th className="text-subtle w-px px-2 pt-2 pb-3 text-right text-xs font-medium tracking-wide uppercase">
                Punkte
              </th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-subtle px-2 py-6 text-center">
                  Noch keine Tipps gewertet.
                </td>
              </tr>
            ) : (
              ranking.map((entry) => (
                <tr key={entry.userId} className="border-input border-b last:border-b-0">
                  <td className="w-px px-2 py-3 tabular-nums">{entry.rank}</td>
                  <td className="px-2 py-3">{entry.name}</td>
                  <td className="px-2 py-3 text-right font-medium tabular-nums">{entry.points}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
