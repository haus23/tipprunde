import { AppLink } from "#/components/app-link.tsx";
import type { BlogPostSummary } from "#/lib/content.server.ts";
import { formatDate } from "#/lib/utils.ts";

/** Date and title per article, newest first — the Nachspielzeit page and the
 * homepage's teaser of the latest ones. */
export function PostList({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0)
    return <p className="text-subtle text-base">Noch nichts in der Nachspielzeit.</p>;

  return (
    <ul role="list" className="flex flex-col">
      {posts.map((post) => (
        <li key={post.slug} className="border-subtle border-b py-3 first:pt-0 last:border-b-0">
          <p className="text-muted mb-0.5 text-xs tracking-wide uppercase">
            {formatDate(post.date)}
          </p>
          {/* -ml-1 offsets AppLink's own p-1, so the title lines up with the date. */}
          <div className="-ml-1">
            <AppLink href={`/nachspielzeit/${post.slug}`}>{post.title}</AppLink>
          </div>
        </li>
      ))}
    </ul>
  );
}
