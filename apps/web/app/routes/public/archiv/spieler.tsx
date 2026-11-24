import { FixedDigits, cx } from "@tipprunde/ui";
import { FoldersIcon } from "lucide-react";
import { data, Link } from "react-router";

import { AppLink } from "#/components/app-link.tsx";
import { PlayerSwitch } from "#/components/player-switch.tsx";
import { getArchivPlayer, getEwigeTabelle } from "#/lib/archiv.server.ts";
import { formatPoints, shortChampionshipName, sortGerman } from "#/lib/utils.ts";

import type { Route } from "./+types/spieler";

/**
 * One player across the Archiv: every completed championship they played,
 * with rank and points, and the sums of exactly those rows on top. Reached
 * from a name in the Ewige Tabelle; the switcher beside the name moves to the
 * next player.
 * No index route at /archiv/spieler — nothing in the app links there, so a
 * bare or unknown slug is the shell's ordinary 404.
 */
export async function loader({ params }: Route.LoaderArgs) {
  const [found, ewigeTabelle] = await Promise.all([
    getArchivPlayer(params.slug),
    getEwigeTabelle(),
  ]);
  // Thrown from the loader, not middleware, so the public shell's
  // ErrorBoundary renders it. Not in the Ewige Tabelle at all (an admin who
  // never tipped) means no page; a newcomer in the running championship does
  // get one, with an empty list until their first championship is completed.
  if (!found || !ewigeTabelle.some((e) => e.slug === params.slug)) {
    throw data("Spieler nicht gefunden.", { status: 404 });
  }

  // Summed from the rows shown below, not taken from the Ewige Tabelle: that
  // one counts the running championship too, the page does not.
  const rows = found.championships;
  const ranks = rows.flatMap((c) => (c.rank !== null ? [c.rank] : []));

  return {
    player: found.player,
    championships: rows,
    summary: {
      played: rows.length,
      wins: ranks.filter((r) => r === 1).length,
      totalPoints: rows.reduce((sum, c) => sum + (c.total ?? 0), 0),
      bestRank: ranks.length > 0 ? Math.min(...ranks) : null,
    },
    // Alphabetical, not by Ewige Tabelle rank: the switcher is for finding a
    // name, and it has a search field — the ranking order is one click back.
    switchPlayers: sortGerman(
      ewigeTabelle.map((e) => ({ slug: e.slug, name: e.name })),
      (p) => p.name,
    ),
  };
}

const navLinkClass =
  "text-subtle hover:text-app focus-visible:ring-accent flex items-center gap-1 rounded-sm outline-none transition-colors focus-visible:ring-2";

export default function ArchivSpieler({ loaderData }: Route.ComponentProps) {
  const { player, championships, summary, switchPlayers } = loaderData;

  const facts = [
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
        {summary.played > 0 && (
          <p className="text-subtle text-center text-sm leading-relaxed">{facts.join(" · ")}</p>
        )}
      </div>

      {championships.length === 0 ? (
        // A newcomer: in the Ewige Tabelle with the running championship
        // already, but nothing on record here until it is completed.
        <p className="text-subtle py-16 text-center text-base">
          Noch kein abgeschlossenes Turnier.
        </p>
      ) : (
        <div className="mx-auto w-full max-w-3xl overflow-x-auto">
          <table aria-label={`Turniere von ${player.name}`} className="w-full text-base">
            <thead>
              <tr className="text-muted text-xs tracking-wide uppercase">
                <th className="border-subtle xs:px-3 xs:py-2.5 border-b px-2 py-2 text-left font-medium">
                  Turnier
                </th>
                <th className="border-subtle xs:px-3 xs:py-2.5 w-px border-b px-2 py-2 text-right font-medium">
                  {/* Same "Pl." as the other tables below xs. */}
                  <span className="xs:hidden">Pl.</span>
                  <span className="xs:inline hidden">Platz</span>
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
                      <span className="xs:hidden">{shortChampionshipName(c.name)}</span>
                      <span className="xs:inline hidden">{c.name}</span>
                    </AppLink>
                    {c.rank === 1 && (
                      <span aria-hidden="true" className="text-gold ml-1">
                        ★
                      </span>
                    )}
                  </td>
                  <td className="xs:px-3 xs:py-3 px-2 py-2 text-right whitespace-nowrap">
                    {c.rank !== null ? (
                      <>
                        <span
                          className={cx(
                            "font-display text-xl leading-none",
                            c.rank <= 3 ? "text-accent" : "text-subtle",
                          )}
                        >
                          <FixedDigits value={c.rank} />
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
                  <td className="font-display xs:px-3 xs:py-3 px-2 py-2 text-center text-xl leading-none">
                    {c.total !== null ? <FixedDigits value={formatPoints(c.total)} /> : "–"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
