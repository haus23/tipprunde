import type { Route } from './+types/_index';

import { env } from '~/utils/.server/env';

export function meta() {
  return [{ title: 'runde.tips' }];
}

export async function loader() {
  const response = await fetch(`${env.UNTERBAU_URL}/api/v1/championships`);
  const data = (await response.json()) as Record<string, string>[];
  return { championship: data[0] };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1 className="font-medium text-2xl">runde.tips</h1>
      <h2 className="font-medium text-2xl">{loaderData.championship.name}</h2>
    </div>
  );
}
