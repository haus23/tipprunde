import type { Route } from './+types/index';

import { appContext } from '~/utils/app-context.server';

export function meta() {
  return [{ title: 'runde.tips' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  // @ts-ignore
  const appCtx = context.get(appContext);

  const response = await fetch(
    `${appCtx.cloudflare.env.UNTERBAU_URL}/api/v1/championships`,
  );
  const data = (await response.json()) as Record<string, string>[];
  return { championship: data[0] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-2">
      <h1 className="font-medium text-2xl">runde.tips</h1>
      <h2 className="font-medium text-2xl">{loaderData.championship.name}</h2>
    </div>
  );
}
