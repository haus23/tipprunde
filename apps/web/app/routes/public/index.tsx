import { ChampionshipCurrentMatches } from "#/components/championship-current-matches.tsx";
import { ChampionshipScopeProvider } from "#/components/championship-scope.tsx";
import { ChampionshipStandings } from "#/components/championship-standings.tsx";
import { PostList } from "#/components/post-list.tsx";
import { SectionHeading } from "#/components/section-heading.tsx";
import { SectionLink } from "#/components/section-link.tsx";
import { getPublicChampionships, getPublishedChampionship } from "#/lib/championship.server.ts";
import { getBlogPosts } from "#/lib/content.server.ts";
import { userContext } from "#/lib/context.ts";
import { getRanking } from "#/lib/ranking.server.ts";
import { getCurrentMatches } from "#/lib/spiele.server.ts";

import type { Route } from "./+types/index";
import { ChampionshipSwitcher } from "./_switcher.tsx";

/** How many of the latest articles the homepage teases. */
const LATEST_POSTS = 3;

/**
 * The site's homepage — not a championship view. It borrows two modules from
 * the running championship's overview (standings, current matches) and adds
 * the latest articles; the championship's own overview at /turnier carries
 * the rest (Stadionsenf comment, ruleset). See
 * docs/decisions/11-turnier-routing-homepage.md.
 */
export async function loader({ context }: Route.LoaderArgs) {
  const championship = await getPublishedChampionship();
  const [publicChampionships, posts, ranking, matches] = await Promise.all([
    getPublicChampionships(),
    getBlogPosts(),
    championship ? getRanking(championship.id) : Promise.resolve([]),
    championship ? getCurrentMatches(championship.id) : Promise.resolve([]),
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
    posts: posts.slice(0, LATEST_POSTS),
    userId: context.get(userContext)?.id,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { championship, switcherChampionships, ranking, matches, posts, userId } = loaderData;

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>runde.tips</title>
      <div className="mb-10 flex flex-col items-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
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
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              <ChampionshipStandings
                ranking={ranking}
                completed={championship.completed}
                userId={userId}
              />
              <ChampionshipCurrentMatches matches={matches} completed={championship.completed} />
            </div>
          </ChampionshipScopeProvider>
        )}

        <section>
          <SectionHeading>Nachspielzeit</SectionHeading>
          <PostList posts={posts} />
          <div className="mt-4 flex justify-end">
            <SectionLink to="/nachspielzeit">Mehr aus der Nachspielzeit →</SectionLink>
          </div>
        </section>
      </div>
    </div>
  );
}
