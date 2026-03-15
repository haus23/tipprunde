import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manager/$slug/turnier")({
  beforeLoad: () => ({ pageTitle: "Turnier" }),
  loader: ({ context }) => ({ championshipName: context.currentChampionship?.name }),
  head: ({ loaderData }) => ({
    meta: [{ title: `Turnier | ${loaderData?.championshipName}` }],
  }),
  component: TurnierPage,
});

function TurnierPage() {
  const { currentChampionship } = Route.useRouteContext();
  return (
    <div>
      <p>{currentChampionship?.name}</p>
    </div>
  );
}
