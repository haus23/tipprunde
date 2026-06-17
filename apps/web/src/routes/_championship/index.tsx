import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { hasExtraQuestions } from "@tipprunde/domain/ranking";
import { RULE_CATEGORIES } from "@tipprunde/domain/rules";

import { CellLink } from "#/components/cell-link.tsx";
import { archivPreviewQueryOptions } from "#/lib/archiv.ts";
import type { ArchivEntry } from "#/lib/archiv.ts";
import { formatDate } from "#/lib/format.ts";
import { rankingQueryOptions } from "#/lib/ranking.ts";
import type { RankedPlayer } from "#/lib/ranking.ts";
import { rulesetQueryOptions } from "#/lib/ruleset.ts";
import type { Ruleset } from "#/lib/ruleset.ts";
import type { SessionUser } from "#/lib/session.ts";
import { currentMatchesQueryOptions } from "#/lib/spiele.ts";
import type { CurrentMatch } from "#/lib/spiele.ts";

export const Route = createFileRoute("/_championship/")({
  loader: ({ context }) => {
    const id = context.championship?.id;
    if (id !== undefined) {
      return Promise.all([
        context.queryClient.ensureQueryData(rankingQueryOptions(id)),
        context.queryClient.ensureQueryData(currentMatchesQueryOptions(id)),
        context.queryClient.ensureQueryData(rulesetQueryOptions(id)),
        context.queryClient.ensureQueryData(archivPreviewQueryOptions(id)),
      ]);
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { championship, user } = Route.useRouteContext();

  if (!championship) {
    return (
      <div className="mx-auto w-full max-w-4xl py-8">
        <p className="text-subtle py-16 text-center text-base">Kein aktives Turnier.</p>
      </div>
    );
  }

  return (
    <Dashboard
      championshipId={championship.id}
      championshipName={championship.name}
      completed={championship.completed}
      user={user}
    />
  );
}

function Dashboard({
  championshipId,
  championshipName,
  completed,
  user,
}: {
  championshipId: number;
  championshipName: string;
  completed: boolean;
  user: SessionUser | null;
}) {
  const { data: ranking } = useSuspenseQuery(rankingQueryOptions(championshipId));
  const {
    data: { matches },
  } = useSuspenseQuery(currentMatchesQueryOptions(championshipId));
  const {
    data: { ruleset },
  } = useSuspenseQuery(rulesetQueryOptions(championshipId));
  const {
    data: { championships: archivChampionships },
  } = useSuspenseQuery(archivPreviewQueryOptions(championshipId));

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <div className="mb-10 flex flex-col items-center">
        <p className="text-subtle text-xs tracking-widest uppercase">Haus23</p>
        <h1 className="text-3xl font-semibold tracking-tight">Tipprunde</h1>
        <p className="text-subtle mt-1 text-lg">{championshipName}</p>
      </div>

      <div className="xs:px-6 flex flex-col gap-10 px-4">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          <Standings ranking={ranking} completed={completed} userId={user?.id} />
          <CurrentMatches matches={matches} completed={completed} />
        </div>
        {ruleset && <Regelwerk ruleset={ruleset} />}
        {archivChampionships.length > 0 && <ArchivPreview championships={archivChampionships} />}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-muted mb-3 text-xs font-medium tracking-wide uppercase">{children}</h2>
  );
}

function SectionLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="text-subtle hover:text-app focus-visible:ring-accent rounded-sm p-1 text-xs transition-colors outline-none focus-visible:ring-2"
    >
      {children}
    </Link>
  );
}

function Standings({
  ranking,
  completed,
  userId,
}: {
  ranking: RankedPlayer[];
  completed: boolean;
  userId: number | undefined;
}) {
  const top3 = ranking.slice(0, 3);
  const userEntry = userId !== undefined ? ranking.find((e) => e.userId === userId) : undefined;
  const userBelowTop3 =
    userEntry && !top3.some((e) => e.userId === userEntry.userId) ? userEntry : undefined;
  const hasGap = userBelowTop3 ? ranking.indexOf(userBelowTop3) > 3 : false;

  return (
    <section className="flex flex-col">
      <SectionHeading>{completed ? "Abschlusstabelle" : "Aktuelle Tabelle"}</SectionHeading>
      <table className="w-full text-base">
        <tbody>
          {top3.map((entry, index) => {
            const sharesRankAbove = index > 0 && top3[index - 1].rank === entry.rank;
            const isUser = userId === entry.userId;
            return (
              <tr key={entry.userId} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle w-px py-2 pr-3 text-right tabular-nums">
                  {sharesRankAbove ? "" : entry.rank}
                </td>
                <td className={`py-2 ${isUser ? "text-accent" : ""}`}>
                  <CellLink to="/spieler/{-$slug}" params={{ slug: entry.slug }}>
                    {entry.name}
                  </CellLink>
                </td>
                <td className="py-2 text-right font-medium tabular-nums">{entry.total}</td>
              </tr>
            );
          })}
        </tbody>
        {userBelowTop3 && (
          <tbody>
            {hasGap && (
              <tr>
                <td colSpan={3} className="text-subtle py-1 text-center text-xs">
                  ⋮
                </td>
              </tr>
            )}
            <tr className="border-subtle border-t">
              <td className="text-subtle w-px py-2 pr-3 text-right tabular-nums">
                {userBelowTop3.rank}
              </td>
              <td className="text-accent py-2">
                <CellLink to="/spieler/{-$slug}" params={{ slug: userBelowTop3.slug }}>
                  {userBelowTop3.name}
                </CellLink>
              </td>
              <td className="py-2 text-right font-medium tabular-nums">{userBelowTop3.total}</td>
            </tr>
          </tbody>
        )}
      </table>
      <div className="mt-3 flex justify-end">
        <SectionLink to="/tabelle">Vollständige Tabelle →</SectionLink>
      </div>
    </section>
  );
}

function CurrentMatches({ matches, completed }: { matches: CurrentMatch[]; completed: boolean }) {
  return (
    <section className="flex flex-col">
      <SectionHeading>{completed ? "Letzte Spiele" : "Aktuelle Spiele"}</SectionHeading>
      {matches.length === 0 ? (
        <p className="text-subtle text-base">Noch keine Spiele.</p>
      ) : (
        <table className="w-full text-base">
          <tbody>
            {matches.map((match) => (
              <tr key={match.nr} className="border-subtle border-b last:border-b-0">
                <td className="text-subtle w-px py-2 pr-3 text-xs whitespace-nowrap tabular-nums">
                  {match.date ? formatDate(match.date) : "–"}
                </td>
                <td className="py-2">
                  <CellLink to="/spiele/$nr" params={{ nr: String(match.nr) }}>
                    <span className="hidden lg:inline">{match.paarung}</span>
                    <span className="lg:hidden">{match.paarungShort}</span>
                  </CellLink>
                </td>
                <td className="text-subtle w-px py-2 pl-3 text-right tabular-nums">
                  {match.result ?? "–:–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-3 flex justify-end">
        <SectionLink to="/spiele">Komplette Übersicht →</SectionLink>
      </div>
    </section>
  );
}

function ArchivPreview({ championships }: { championships: ArchivEntry[] }) {
  return (
    <section>
      <SectionHeading>Archiv</SectionHeading>
      <table className="w-full text-base">
        <thead>
          <tr className="text-muted border-subtle border-b text-xs">
            <th className="pb-1.5 text-left font-medium">Turnier</th>
            <th className="pr-3 pb-1.5 text-left font-medium">Sieger</th>
            <th className="pb-1.5 text-right font-medium">Punkte</th>
          </tr>
        </thead>
        <tbody>
          {championships.map((entry) => (
            <tr key={entry.slug} className="border-subtle border-b last:border-b-0">
              <td className="text-subtle py-2 pr-3 text-sm">{entry.name}</td>
              <td className="py-2 pr-3">
                {entry.winners.map((w, i) => (
                  <span key={w.slug}>
                    {i > 0 && ", "}
                    {w.name}
                  </span>
                ))}
              </td>
              <td className="py-2 text-right font-medium tabular-nums">
                {entry.winners[0]?.total ?? "–"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex justify-end">
        <SectionLink to="/archiv">Komplettes Archiv →</SectionLink>
      </div>
    </section>
  );
}

function Regelwerk({ ruleset }: { ruleset: Ruleset }) {
  const activeRules = RULE_CATEGORIES.flatMap(({ field, label, rules }) => {
    const ruleId = ruleset[field];
    if (!ruleId || ruleId === "keine-besonderheiten") return [];
    const rule = rules.find((r) => r.value === ruleId);
    return rule ? [{ label, description: rule.description }] : [];
  });
  const showExtraQuestions = hasExtraQuestions({
    extraQuestionRuleId: ruleset.extraQuestionRuleId,
  });

  return (
    <section className="sm:mx-auto sm:max-w-lg">
      <SectionHeading>Regelwerk</SectionHeading>
      <p className="text-subtle text-base">{ruleset.description}</p>
      <div className="mt-4 flex flex-col gap-3">
        {activeRules.map((rule) => (
          <div key={rule.label}>
            <p className="text-base font-medium">{rule.label}</p>
            <p className="text-subtle text-base">{rule.description}</p>
          </div>
        ))}
      </div>
      {showExtraQuestions && (
        <div className="mt-4 flex justify-end">
          <SectionLink to="/zusatzfragen">Zusatzfragen →</SectionLink>
        </div>
      )}
    </section>
  );
}
