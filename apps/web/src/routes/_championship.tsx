import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { db } from "#/lib/db.server.ts";

const getChampionship = createServerFn().handler(async () => {
  const championship = await db.query.championships.findFirst({
    where: { published: true },
    orderBy: { nr: "desc" },
  });
  return { championship };
});

export const Route = createFileRoute("/_championship")({
  beforeLoad: async () => {
    const { championship } = await getChampionship();
    return { championship };
  },
  component: () => <Outlet />,
});
