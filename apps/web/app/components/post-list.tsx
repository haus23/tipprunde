import { cx } from "@tipprunde/ui";

import { AppLink } from "#/components/app-link.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import type { BlogPostSummary } from "#/lib/content.server.ts";
import { formatDate } from "#/lib/utils.ts";

/** Date and title per article, newest first — the Nachspielzeit page (with
 * excerpts) and the homepage's teaser of the latest ones (titles only). */
export function PostList({
  posts,
  withExcerpts = false,
}: {
  posts: BlogPostSummary[];
  withExcerpts?: boolean;
}) {
  if (posts.length === 0)
    return <p className="text-subtle text-base">Noch nichts in der Nachspielzeit.</p>;

  return (
    <ul role="list" className="flex flex-col">
      {posts.map((post) => {
        const href = `/nachspielzeit/${post.slug}`;
        const excerpt = withExcerpts ? post.excerptHtml : null;
        return (
          <li
            key={post.slug}
            className={cx(
              "border-subtle border-b first:pt-0 last:border-b-0",
              withExcerpts ? "py-6" : "py-3",
            )}
          >
            <p className="text-muted mb-0.5 text-xs tracking-wide uppercase">
              {formatDate(post.date)}
            </p>
            {/* -ml-1 offsets AppLink's own p-1, so the title lines up with the date. */}
            <div className={cx("-ml-1", withExcerpts && "text-lg font-semibold")}>
              <AppLink href={href}>{post.title}</AppLink>
            </div>
            {excerpt && (
              <>
                {/* Markdown from our own repo, never user input — safe to inject. */}
                <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: excerpt }} />
                <div className="mt-2 flex justify-end">
                  <SectionLink to={href}>Weiterlesen →</SectionLink>
                </div>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
