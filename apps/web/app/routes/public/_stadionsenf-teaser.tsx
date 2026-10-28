import { AppLink } from "#/components/app-link.tsx";
import { useScopedPath } from "#/components/championship-scope.tsx";
import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import type { TurnierComment } from "#/lib/content.server.ts";

/**
 * The homepage's pointer to a finished championship's Stadionsenf: title,
 * the excerpt above `<!-- more -->` if the author set one, and the way to the
 * full text beside the table on the championship's own page.
 */
export function StadionsenfTeaser({ comment }: { comment: TurnierComment }) {
  const scoped = useScopedPath();

  return (
    <section>
      <SectionHeading>Stadionsenf</SectionHeading>
      {/* -ml-1 offsets AppLink's own p-1, so the title lines up with the heading. */}
      <div className="-ml-1 text-lg font-semibold">
        <AppLink href={scoped("/")}>{comment.title}</AppLink>
      </div>
      {comment.excerptHtml && (
        // Markdown from our own repo, never user input — safe to inject.
        <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: comment.excerptHtml }} />
      )}
      <div className="mt-2 flex justify-end">
        <SectionLink to={scoped("/")}>Weiterlesen →</SectionLink>
      </div>
    </section>
  );
}
