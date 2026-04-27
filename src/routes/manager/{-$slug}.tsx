import { createFileRoute, Outlet, useParams } from "@tanstack/react-router";

import { fetchCurrentChampionshipFn } from "#/app/manager/championships.ts";
import { updateManagerShellSettingsFn } from "#/app/settings/manager-shell.ts";

export const Route = createFileRoute("/manager/{-$slug}")({
  beforeLoad: async ({ params: { slug } }) => {
    const championship = await fetchCurrentChampionshipFn({ data: slug });
    return { championship };
  },
  loader: async ({ params: { slug } }) => {
    await updateManagerShellSettingsFn({ data: { activeSlug: slug } });
  },
  component: SlugLayout,
});

function SlugLayout() {
  const { slug } = useParams({ from: "/manager/{-$slug}" });
  return (
    <div key={slug}>
      <Outlet />
    </div>
  );
}
