import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/$slug/")({
  beforeLoad: () => ({ pageTitle: "Dashboard" }),
  loader: ({ context }) => ({ championshipName: context.currentChampionship?.name }),
  head: ({ loaderData }) => ({
    meta: [{ title: `Dashboard | ${loaderData?.championshipName}` }],
  }),
  component: ChampionshipDashboard,
});

function ChampionshipDashboard() {
  const { currentChampionship } = Route.useRouteContext();
  return (
    <div>
      <p>{currentChampionship?.name}</p>
    </div>
  );
}
