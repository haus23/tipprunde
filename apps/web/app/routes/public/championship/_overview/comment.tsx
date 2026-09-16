import { SectionHeading } from "#/components/section-heading.tsx";
import type { TurnierComment } from "#/lib/content.server.ts";

export function ChampionshipComment({ comment }: { comment: TurnierComment }) {
  return (
    <section>
      <SectionHeading>Stadionsenf</SectionHeading>
      <h3 className="mb-2 text-base font-semibold">{comment.title}</h3>
      {/* Markdown from our own repo, never user input — safe to inject. */}
      <div className="prose" dangerouslySetInnerHTML={{ __html: comment.html }} />
    </section>
  );
}
