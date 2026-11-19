import { cx } from "@tipprunde/ui";
import { ArrowLeftIcon } from "lucide-react";
import { data, Link } from "react-router";

import { AppLink } from "#/components/app-link.tsx";
import { getPublicChampionships } from "#/lib/championship.server.ts";
import { getBlogPost } from "#/lib/content.server.ts";
import { formatDate } from "#/lib/utils.ts";

import type { Route } from "./+types/detail";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getBlogPost(params.slug);
  if (!post) throw data("Beitrag nicht gefunden.", { status: 404 });

  // Forward link only: the article names its championships, not the other
  // way round — a championship page listing "related articles" would need a
  // full-directory scan on every championship view for a feature nobody has
  // asked to see there yet.
  const championships =
    post.championships.length === 0
      ? []
      : (await getPublicChampionships()).filter((c) => post.championships.includes(c.slug));

  return { post, championships };
}

// Same quiet back link as the Archiv player page's "Archiv".
const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex w-fit items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

export default function NachspielzeitDetail({ loaderData }: Route.ComponentProps) {
  const { post, championships } = loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`${post.title} · Nachspielzeit · runde.tips`}</title>
      <div className="xs:px-6 mx-auto flex max-w-2xl flex-col gap-6 px-4">
        {/* Without it, the only way on to the other articles was the homepage
            or the nav. */}
        <Link
          to="/nachspielzeit"
          prefetch="intent"
          className={cx(navLinkClass, "text-xs hover:underline")}
        >
          <ArrowLeftIcon className="size-3.5 shrink-0" />
          Alles aus der Nachspielzeit
        </Link>
        <div>
          <p className="text-muted mb-1 text-xs tracking-wide uppercase">
            {formatDate(post.date)}
            {post.updated !== post.date && ` · Aktualisiert ${formatDate(post.updated)}`}
          </p>
          <h1 className="poster-title text-3xl">{post.title}</h1>
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
