import { createFileRoute, Outlet } from "@tanstack/react-router";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";

export const Route = createFileRoute("/manager/{-$slug}")({
  beforeLoad: async ({ params: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    return { championship };
  },
  component: () => <Outlet />,
});
