import { data } from "react-router";

import { AppLink } from "#/components/app-link.tsx";
import { getPublicChampionships } from "#/lib/championship.server.ts";
import { getBlogPost } from "#/lib/content.server.ts";
import { formatDate } from "#/lib/utils.ts";

import type { Route } from "./+types/detail";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getBlogPost(params.slug);
  if (!post) throw data("Beitrag nicht gefunden.", { status: 404 });

  // Forward link only, for v1: the post names its championships, not the
  // other way round — a championship page listing "related posts" would need
  // a full-directory scan on every championship view for a feature nobody
  // has asked to see there yet.
  const championships =
    post.championships.length === 0
      ? []
      : (await getPublicChampionships()).filter((c) => post.championships.includes(c.slug));

  return { post, championships };
}

export default function StadionsenfDetail({ loaderData }: Route.ComponentProps) {
  const { post, championships } = loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`${post.title} · Stadionsenf · runde.tips`}</title>
      <div className="xs:px-6 mx-auto flex max-w-2xl flex-col gap-6 px-4">
        <div>
          <p className="text-muted mb-1 text-xs tracking-wide uppercase">{formatDate(post.date)}</p>
          <h1 className="text-2xl font-semibold tracking-tight">{post.title}</h1>
        </div>

        {/* Markdown from our own repo, never user input — safe to inject. */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {championships.length > 0 && (
          <p className="text-subtle text-sm">
            Bezug:{" "}
            {championships.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && ", "}
                <AppLink href={`/turnier/${c.slug}`}>{c.name}</AppLink>
              </span>
            ))}
          </p>
        )}
      </div>
    </div>
  );
}
