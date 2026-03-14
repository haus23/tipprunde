import { createFileRoute, Outlet } from "@tanstack/react-router";
import { activateChampionship } from "@/lib/championships.ts";

export const Route = createFileRoute("/manager/$slug")({
  beforeLoad: async ({ params }) => {
    const currentChampionship = await activateChampionship({ data: params.slug });
    return { currentChampionship };
  },
  component: () => <Outlet />,
});
