import { ChampionshipCurrentMatches } from "#/components/championship-current-matches.tsx";
import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { ChampionshipStandings } from "#/components/championship-standings.tsx";
import { PostList } from "#/components/post-list.tsx";
import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import { getPublicChampionships, getPublishedChampionship } from "#/lib/championship.server.ts";
import { getBlogPosts, getTurnierComment } from "#/lib/content.server.ts";
import { userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";
import { getCurrentMatches } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/index";
import { StadionsenfTeaser } from "./_stadionsenf-teaser.tsx";
import { ChampionshipSwitcher } from "./_switcher.tsx";

/** How many of the latest articles the homepage teases. */
const LATEST_POSTS = 3;

/**
 * The site's homepage — not a championship view. Next to the running
 * championship's standings it shows what is current about it: the latest
 * matches while it runs, a teaser of its Stadionsenf once it is finished and
 * has one. Below, the latest articles. See
 * docs/decisions/11-turnier-routing-homepage.md and
 * docs/decisions/14-turnier-tabelle-stadionsenf.md.
 */
export async function loader({ context }: Route.LoaderArgs) {
  const championship = await getPublishedChampionship();
  const [publicChampionships, posts, ranking, matches, comment] = await Promise.all([
    getPublicChampionships(),
    getBlogPosts(),
    championship ? getRanking(championship.id) : Promise.resolve([]),
    championship ? getCurrentMatches(championship.id) : Promise.resolve([]),
    // Only a finished championship shows its Stadionsenf here — while one
    // runs, the matches win even if a comment has already been written.
    championship?.completed ? getTurnierComment(championship.slug) : Promise.resolve(null),
  ]);

  // Sorted nr desc — the first entry is the running championship, reached at
  // /turnier; every other one at its own /turnier/<slug>.
  const runningSlug = publicChampionships[0]?.slug;
  const switcherChampionships = publicChampionships.map((c) => ({
    slug: c.slug,
    name: c.name,
    href: c.slug === runningSlug ? "/turnier" : `/turnier/${c.slug}`,
  }));

  return {
    championship: championship && {
      slug: championship.slug,
      name: championship.name,
      completed: championship.completed,
    },
    switcherChampionships,
    ranking,
    matches,
    comment,
    posts: posts.slice(0, LATEST_POSTS),
    userId: context.get(userContext)?.id,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { championship, switcherChampionships, ranking, matches, comment, posts, userId } =
    loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>runde.tips</title>
      <div className="mb-10 flex flex-col items-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="poster-title poster-title-bar text-4xl">Tipprunde</h1>
        {championship && (
          // relative + inline-block: the switcher trigger sits absolute,
          // outside the flow, so it can't push the name off-centre the way a
          // flex row of [name, button] would.
          <p className="text-subtle relative mt-1 inline-block text-lg">
            {championship.name}
            <ChampionshipSwitcher
              championships={switcherChampionships}
              currentSlug={championship.slug}
              triggerClassName="absolute left-full top-1/2 ml-1 -translate-y-1/2"
            />
          </p>
        )}
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        {championship && (
          // The modules build their links through the championship scope —
          // here that's the running championship at /turnier.
          <ChampionshipScopeProvider basePath="/turnier">
            {/* Right column: the latest matches while the championship
                runs; once it is over its Stadionsenf, or the last matches
                until somebody has written one. */}
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              <ChampionshipStandings
                ranking={ranking}
                completed={championship.completed}
                userId={userId}
              />
              {comment ? (
                <StadionsenfTeaser comment={comment} />
              ) : (
                <ChampionshipCurrentMatches matches={matches} completed={championship.completed} />
              )}
            </div>
          </ChampionshipScopeProvider>
        )}

        <section>
          <SectionHeading>Nachspielzeit</SectionHeading>
          <PostList posts={posts} withExcerpts />
          <div className="mt-4 flex justify-end">
            <SectionLink to="/nachspielzeit">Mehr aus der Nachspielzeit →</SectionLink>
          </div>
        </section>
      </div>
    </div>
  );
}
