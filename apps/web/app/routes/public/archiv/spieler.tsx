import { cx } from "@tipprunde/ui";
import { FoldersIcon } from "lucide-react";
import { data, Link } from "react-router";

import { AppLink } from "#/components/app-link.tsx";
import { PlayerSwitch } from "#/components/player-switch.tsx";
import { getArchivPlayer, getEwigeTabelle } from "#/lib/archiv.server.ts";
import { formatPoints, sortGerman } from "#/lib/utils.ts";

import type { Route } from "./+types/spieler";

/**
 * One player across the Archiv: every championship they played, with rank and
 * points, plus their line of the Ewige Tabelle on top. Reached from a name in
 * the Ewige Tabelle; the switcher beside the name moves to the next player.
 * No index route at /archiv/spieler — nothing in the app links there, so a
 * bare or unknown slug is the shell's ordinary 404.
 */
export async function loader({ params }: Route.LoaderArgs) {
  const [found, ewigeTabelle] = await Promise.all([
    getArchivPlayer(params.slug),
    getEwigeTabelle(),
  ]);
  // Thrown from the loader, not middleware, so the public shell's
  // ErrorBoundary renders it. A user without a published championship (an
  // admin who never tipped) has no Archiv page either.
  const entry = ewigeTabelle.find((e) => e.slug === params.slug);
  if (!found || !entry || found.championships.length === 0) {
    throw data("Spieler nicht gefunden.", { status: 404 });
  }

  const completedRanks = found.championships
    .filter((c) => c.completed && c.rank !== null)
    .map((c) => c.rank!);

  return {
    player: found.player,
    championships: found.championships,
    summary: {
      rank: entry.rank,
      played: entry.played,
      wins: entry.wins,
      totalPoints: entry.totalPoints,
      bestRank: completedRanks.length > 0 ? Math.min(...completedRanks) : null,
    },
    // Alphabetical, not by Ewige Tabelle rank: the switcher is for finding a
    // name, and it has a search field — the ranking order is one click back.
    switchPlayers: sortGerman(
      ewigeTabelle.map((e) => ({ slug: e.slug, name: e.name })),
      (p) => p.name,
    ),
  };
}

/**
 * "Hinrunde 2008/09" → "HR 08/09", "Rückrunde 2007/08" → "RR 07/08"; the
 * tournaments ("EM 2008", "WM 2006") are short already. Below xs only, where
 * the long half-season names would wrap.
 */
function shortName(name: string) {
  const m = /^(Hin|Rück)runde \d{2}(\d{2})\/(\d{2})$/.exec(name);
  return m ? `${m[1] === "Hin" ? "HR" : "RR"} ${m[2]}/${m[3]}` : name;
}

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

export default function ArchivSpieler({ loaderData }: Route.ComponentProps) {
  const { player, championships, summary, switchPlayers } = loaderData;

  const facts = [
    `Platz ${summary.rank} der Ewigen Tabelle`,
    summary.played === 1 ? "1 Turnier" : `${summary.played} Turniere`,
    summary.wins > 0 && (summary.wins === 1 ? "1 Sieg" : `${summary.wins} Siege`),
    summary.bestRank !== null && summary.wins === 0 && `bester Platz: ${summary.bestRank}`,
    `${formatPoints(summary.totalPoints)} Punkte`,
  ].filter(Boolean);

  return (
    <div className="mx-auto w-full max-w-4xl py-8">
      <title>{`${player.name} · Archiv · runde.tips`}</title>

      {/* Same back link as the championship chrome's "Archiv", landing on the
          table the visitor most likely came from. */}
      <div className="xs:px-0 flex justify-center px-4">
        <Link
          to="/archiv#ewige-tabelle"
          prefetch="intent"
          className={cx(navLinkClass, "text-xs hover:underline")}
        >
          <FoldersIcon className="size-3.5 shrink-0" />
          Archiv
        </Link>
      </div>

      <div className="xs:px-0 mt-6 mb-6 flex flex-col items-center gap-2 px-4">
        <div className="flex items-center gap-1.5">
          <h1 className="poster-title text-3xl">{player.name}</h1>
          <PlayerSwitch
            players={switchPlayers}
            currentSlug={player.slug}
            hrefFor={(slug) => `/archiv/spieler/${slug}`}
          />
        </div>
        <p className="text-subtle text-center text-sm leading-relaxed">{facts.join(" · ")}</p>
      </div>

      <div className="mx-auto w-full max-w-3xl overflow-x-auto">
        <table className="w-full text-base">
          <thead>
            <tr className="text-muted text-xs tracking-wide uppercase">
              <th className="border-subtle xs:px-3 xs:py-2.5 border-b px-2 py-2 text-left font-medium">
                Turnier
              </th>
              <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-right font-medium">
                Platz
              </th>
              <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
                <span className="xs:inline hidden">Zusatzpunkte</span>
                <span className="xs:hidden">Zusatz</span>
              </th>
              <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-center font-medium">
                <span className="xs:inline hidden">Gesamtpunkte</span>
                <span className="xs:hidden">Gesamt</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {championships.map((c) => (
              <tr key={c.slug} className="border-subtle border-b last:border-0">
                <td className="xs:px-3 xs:py-3 px-2 py-2">
                  <AppLink href={`/turnier/${c.slug}`} aria-label={c.name}>
                    <span className="xs:hidden">{shortName(c.name)}</span>
                    <span className="xs:inline hidden">{c.name}</span>
                  </AppLink>
                  {c.completed && c.rank === 1 && (
                    <span aria-hidden="true" className="text-gold ml-1">
                      ★
                    </span>
                  )}
                  {/* Rank and points of the running championship are live, so
                      they can still move — same rule as the Ewige Tabelle. */}
                  {!c.completed && <span className="text-muted ml-2 text-xs">läuft</span>}
                </td>
                <td className="xs:px-3 xs:py-3 px-2 py-2 text-right whitespace-nowrap">
                  {c.rank !== null ? (
                    <>
                      <span
                        className={cx(
                          "font-display text-xl leading-none tracking-wider tabular-nums",
                          c.rank <= 3 ? "text-accent" : "text-subtle",
                        )}
                      >
                        {c.rank}
                      </span>
                      <span className="text-muted text-xs tabular-nums"> / {c.fieldSize}</span>
                    </>
                  ) : (
                    "–"
                  )}
                </td>
                <td className="text-subtle xs:px-3 xs:py-3 px-2 py-2 text-center tabular-nums">
                  {c.extraQuestionPoints ? formatPoints(c.extraQuestionPoints) : "–"}
                </td>
                <td className="font-display xs:px-3 xs:py-3 px-2 py-2 text-center text-xl leading-none tracking-wider tabular-nums">
                  {c.total !== null ? formatPoints(c.total) : "–"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
