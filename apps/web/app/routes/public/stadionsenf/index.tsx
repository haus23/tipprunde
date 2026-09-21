import { AppLink } from "#/components/app-link.tsx";
import { getBlogPosts } from "#/lib/content.server.ts";
import { formatDate } from "#/lib/utils.ts";

import type { Route } from "./+types/index";

export async function loader() {
  return { posts: await getBlogPosts() };
}

export default function StadionsenfIndex({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>Stadionsenf · runde.tips</title>
      <div className="mb-10 flex flex-col items-center gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">Stadionsenf</h1>
      </div>

      <div className="xs:px-6 flex flex-col gap-6 px-4">
        {posts.length === 0 ? (
          <p className="text-subtle text-base">Noch keine Beiträge.</p>
        ) : (
          <ul role="list" className="flex flex-col gap-6">
            {posts.map((post) => (
              <li key={post.slug} className="border-subtle border-b pb-6 last:border-b-0">
                <p className="text-muted mb-1 text-xs tracking-wide uppercase">
                  {formatDate(post.date)}
                </p>
                <h2 className="text-lg font-semibold">
                  <AppLink href={`/stadionsenf/${post.slug}`}>{post.title}</AppLink>
                </h2>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
