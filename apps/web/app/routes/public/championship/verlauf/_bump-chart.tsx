import { cx } from "@tipprunde/ui";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";

import { useScopedPath } from "#/components/championship-scope.tsx";
import type { VerlaufPlayer, VerlaufStep } from "#/lib/verlauf.server.ts";

const ROW_HEIGHT = 22;
const MARGIN = { top: 10, right: 8, bottom: 24, left: 8 };
/** Gap between a line's end and its name. */
const LABEL_GAP = 8;
/** Ceiling for the name column, so one long name cannot eat the plot. */
const LABEL_MAX = 120;
/**
 * Rough width of one character at the label's 11px — only seeds the
 * reservation, since the server cannot measure text. The real width is
 * measured on mount and corrects this.
 */
const LABEL_CHAR_WIDTH = 6.4;
/** Below this the labels cost more width than they are worth (see plan). */
const LABEL_BREAKPOINT = 640;
/** Server render has no measurement; the client re-lays-out on first frame. */
const DEFAULT_WIDTH = 900;
/** Minimum horizontal room per x-axis label before we start skipping some. */
const LABEL_PITCH = 30;

interface Props {
  steps: VerlaufStep[];
  playedSteps: number;
  /** Ordered by final row — players[0] is the leader. */
  players: VerlaufPlayer[];
  focusSlug: string | undefined;
}

function stepLabel(step: VerlaufStep): string {
  switch (step.kind) {
    case "match":
      return String(step.nr);
    case "roundPoints":
      return "RP";
    case "extraPoints":
      return "ZP";
  }
}

function stepTitle(step: VerlaufStep): string {
  switch (step.kind) {
    case "match":
      // Naming the round only where one closes keeps it informative instead of
      // repeating the same parenthetical down every match of the round.
      return step.endsRound
        ? `Nach Spiel ${step.nr} (Runde ${step.roundNr})`
        : `Nach Spiel ${step.nr}`;
    case "roundPoints":
      return `Rundenpunkte Runde ${step.roundNr}`;
    case "extraPoints":
      return "Mit Zusatzpunkten";
  }
}

/**
 * Early in a championship almost the whole field is level — seven or eight
 * names is normal at match one — so the list is capped rather than allowed to
 * push the readout out of shape.
 */
function formatTiedWith(names: string[]): string {
  if (names.length <= 3) return names.join(", ");
  return `${names.slice(0, 2).join(", ")} und ${names.length - 2} weiteren`;
}

type Readout = {
  focus: { name: string; rank: number; points: number; tiedWith: string[] } | null;
  leader: { name: string; points: number } | null;
};

/** What the crosshair reports at one step: the focused player, and the lead. */
function buildReadout(
  players: VerlaufPlayer[],
  step: number,
  focusSlug: string | undefined,
): Readout {
  const focusPlayer = players.find((p) => p.slug === focusSlug);
  const leaderPlayer = players.find((p) => p.positions[step] === 0);
  const rank = focusPlayer?.ranks[step];

  return {
    focus:
      focusPlayer && rank !== undefined
        ? {
            name: focusPlayer.name,
            rank,
            points: focusPlayer.points[step] ?? 0,
            // The row is unique, the rank is not — so name who shares it.
            tiedWith: players
              .filter((p) => p !== focusPlayer && p.ranks[step] === rank)
              .map((p) => p.name),
          }
        : null,
    leader: leaderPlayer
      ? { name: leaderPlayer.name, points: leaderPlayer.points[step] ?? 0 }
      : null,
  };
}

/** Width of the element, measured on the client; SSR falls back to a default. */
function useMeasuredWidth() {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(DEFAULT_WIDTH);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const measured = entry?.contentRect.width ?? 0;
      if (measured > 0) setWidth(measured);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}

/**
 * Rank progression as a bump chart: one row per player, ordered best-first,
 * every player on their own row at every step.
 *
 * Rows are display rows, not ranks — tied players share a rank but never a
 * row, or their lines would coincide. `calcProgression` assigns them; see
 * docs/verlauf-plan.md.
 */
export function BumpChart({ steps, playedSteps, players, focusSlug }: Props) {
  const { ref, width } = useMeasuredWidth();
  const scoped = useScopedPath();
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const labelsRef = useRef<SVGGElement>(null);
  const [measuredLabelWidth, setMeasuredLabelWidth] = useState<number | null>(null);

  const showLabels = width >= LABEL_BREAKPOINT;
  // The name column takes only what the longest name needs. Estimated from
  // character count for the first paint (the server cannot measure text), then
  // corrected by a real measurement below — in landscape especially, a fixed
  // reservation hands the plot's width to whitespace.
  const longestName = players.reduce((max, p) => Math.max(max, p.name.length), 0);
  const estimatedLabelWidth = Math.min(LABEL_MAX, longestName * LABEL_CHAR_WIDTH + LABEL_GAP);
  const labelWidth = showLabels ? (measuredLabelWidth ?? estimatedLabelWidth) : 0;

  const plotWidth = Math.max(0, width - MARGIN.left - MARGIN.right - labelWidth);
  const plotHeight = players.length * ROW_HEIGHT;
  const height = plotHeight + MARGIN.top + MARGIN.bottom;

  const x = (stepIndex: number) =>
    steps.length > 1 ? (stepIndex / (steps.length - 1)) * plotWidth : plotWidth / 2;
  const y = (row: number) => row * ROW_HEIGHT + ROW_HEIGHT / 2;

  const leader = players[0];
  const focus = players.find((p) => p.slug === focusSlug);
  /** Labels hang off the last played step, not the plot edge — see below. */
  const labelX = x(Math.max(0, playedSteps - 1)) + LABEL_GAP;
  /** SVG has no z-index; paint order is document order. */
  const paintOrder = players.toSorted(
    (a, b) => (a === focus ? 2 : a === leader ? 1 : 0) - (b === focus ? 2 : b === leader ? 1 : 0),
  );

  // Pick x labels that do not collide. Special steps go first so they win the
  // space, and they are walked right-to-left so a final ZP beats an RP sitting
  // right next to it — a dropped RP label still has its rule line below.
  const labelled = new Set<number>();
  const takenX: number[] = [];
  const fits = (stepIndex: number) =>
    takenX.every((taken) => Math.abs(taken - x(stepIndex)) >= LABEL_PITCH);
  const take = (stepIndex: number) => {
    labelled.add(stepIndex);
    takenX.push(x(stepIndex));
  };
  for (let i = steps.length - 1; i >= 0; i--) {
    if (steps[i]?.kind !== "match" && fits(i)) take(i);
  }
  for (let i = 0; i < steps.length; i++) {
    if (steps[i]?.kind === "match" && fits(i)) take(i);
  }

  const line = (player: VerlaufPlayer) =>
    player.positions.map((row, i) => `${x(i)},${y(row)}`).join(" ");

  // Only played steps carry data, so the crosshair never leaves them.
  const lastStep = Math.max(0, playedSteps - 1);
  const stepAt = (clientX: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds || plotWidth <= 0 || steps.length < 2) return 0;
    const ratio = (clientX - bounds.left - MARGIN.left) / plotWidth;
    return Math.min(lastStep, Math.max(0, Math.round(ratio * (steps.length - 1))));
  };

  // The readout always shows a step — the crosshair's while scrubbing, the
  // final one at rest — so its line never empties out and shoves the chart
  // around as you move across it.
  const shownStep = activeStep ?? lastStep;
  const readout = buildReadout(players, shownStep, focusSlug);
  const shownStepDef = steps[shownStep];
  const gap = readout.leader && readout.focus ? readout.leader.points - readout.focus.points : 0;

  // Measure the rendered names once they exist, so the reservation matches the
  // font rather than the estimate. Widths do not depend on where the labels
  // sit, so this settles after one correction.
  const nameKey = players.map((p) => p.name).join("|");
  useEffect(() => {
    if (!showLabels || !labelsRef.current) {
      setMeasuredLabelWidth(null);
      return;
    }
    let widest = 0;
    for (const node of labelsRef.current.querySelectorAll("text")) {
      widest = Math.max(widest, node.getBBox().width);
    }
    if (widest === 0) return;
    const next = Math.min(LABEL_MAX, Math.ceil(widest) + LABEL_GAP);
    setMeasuredLabelWidth((previous) =>
      previous === null || Math.abs(previous - next) > 1 ? next : previous,
    );
    // `width` is in here on purpose: at mount the text may not be laid out yet
    // and getBBox reports 0, and without a re-run the estimate would stand for
    // good. The measured width settles the values, so this cannot loop.
  }, [showLabels, nameKey, width]);

  return (
    <div ref={ref} className="relative w-full">
      {/* Fixed place, not a floating tooltip. A tooltip that dodges the focused
          line has no position the eye can learn, and on a landscape phone the
          chart is taller than the viewport — half the time it landed below the
          fold. min-h reserves the second line so the chart does not shift when
          the text wraps. */}
      <p
        aria-live="polite"
        // Sticky under the h-14 header: on a landscape phone the chart is
        // taller than the viewport, so a readout fixed to the top of the chart
        // scrolls away exactly when you are reading the lower ranks.
        className="text-subtle bg-surface xs:min-h-5 sticky top-14 z-10 mb-1.5 min-h-10 py-1 text-center text-xs leading-5"
      >
        {shownStepDef && <span className="text-muted">{stepTitle(shownStepDef)}</span>}
        {readout.focus && (
          <>
            {" · "}
            <span className="text-accent font-medium">{readout.focus.name}</span>
            {" · Rang "}
            {readout.focus.rank}
            {" · "}
            <span className="tabular-nums">{readout.focus.points}</span> P
            {readout.focus.tiedWith.length > 0 && (
              <> · punktgleich mit {formatTiedWith(readout.focus.tiedWith)}</>
            )}
            {readout.leader && gap > 0 && (
              <>
                {" · Rückstand auf "}
                {readout.leader.name}: <span className="tabular-nums">{gap}</span> P
              </>
            )}
          </>
        )}
      </p>

      <svg
        width={width}
        height={height}
        role="img"
        tabIndex={0}
        onKeyDown={(event) => {
          // Functional updates, so a held-down arrow key does not lose steps
          // to a stale closure between renders.
          switch (event.key) {
            case "ArrowRight":
              setActiveStep((step) => Math.min(lastStep, (step ?? -1) + 1));
              break;
            case "ArrowLeft":
              setActiveStep((step) => Math.max(0, (step ?? 1) - 1));
              break;
            case "Home":
              setActiveStep(0);
              break;
            case "End":
              setActiveStep(lastStep);
              break;
            case "Escape":
              setActiveStep(null);
              return;
            default:
              return;
          }
          event.preventDefault();
        }}
        onBlur={() => setActiveStep(null)}
        // max-w-full is the safety net: the width is only known after mount, so
        // the very first paint uses a default that may exceed the container.
        // Clipping one frame is fine; a horizontally scrolling page is not.
        className="focus-visible:outline-accent max-w-full rounded-sm outline-none focus-visible:outline-2"
        aria-label={
          `Verlauf: Rangentwicklung von ${players.length} Spielern über ` +
          `${playedSteps} gewertete Schritte.` +
          (focus ? ` Hervorgehoben: ${focus.name}.` : "")
        }
      >
        <g transform={`translate(${MARGIN.left},${MARGIN.top})`}>
          {/* Row guides — one per rank position, recessive. */}
          {players.map((_, row) => (
            <line
              key={row}
              x1={0}
              x2={plotWidth}
              y1={y(row)}
              y2={y(row)}
              stroke="currentColor"
              strokeWidth={1}
              className="text-subtle opacity-10"
            />
          ))}

          {/* Divider at each round's end — its RP column where there is one,
              otherwise its last match. Never on the final step: a line with
              nothing after it just boxes the chart in. That also keeps the ZP
              column open on the right while still being fenced off on the
              left by the preceding round's divider. */}
          {steps.map((step, i) =>
            step.endsRound && i < steps.length - 1 ? (
              <line
                key={`divider-${i}`}
                x1={x(i)}
                x2={x(i)}
                y1={0}
                y2={plotHeight}
                stroke="currentColor"
                strokeWidth={1}
                className="text-subtle opacity-25"
              />
            ) : null,
          )}

          {/* One keyed line per player, ordered context → leader → focus so
              SVG paint order puts the important ones on top. Deliberately a
              single list: rendering the layers as separate blocks would remount
              a line whenever the focus moves, and a remounted element cannot
              transition — switching players would snap instead of fading. */}
          {paintOrder.map((player) => {
            const isFocus = player === focus;
            const isLeader = !isFocus && player === leader;
            return (
              <polyline
                key={player.userId}
                points={line(player)}
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cx(
                  "transition-[stroke-width,opacity,color] duration-200 ease-out",
                  isFocus
                    ? "text-accent [stroke-width:2.5]"
                    : isLeader
                      ? "text-app opacity-70 [stroke-width:2]"
                      : "text-subtle opacity-30 [stroke-width:1.5]",
                )}
              />
            );
          })}

          {/* Hit area for the crosshair. Pointer moves only track a mouse —
              on touch a tap sets the step and it stays put, so dragging over
              the chart still scrolls the page. */}
          <rect
            x={0}
            y={0}
            width={plotWidth}
            height={plotHeight}
            fill="transparent"
            onPointerDown={(event) => setActiveStep(stepAt(event.clientX))}
            onPointerMove={(event) => {
              if (event.pointerType === "mouse") setActiveStep(stepAt(event.clientX));
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") setActiveStep(null);
            }}
          />

          {activeStep !== null && (
            <>
              <line
                x1={x(activeStep)}
                x2={x(activeStep)}
                y1={0}
                y2={plotHeight}
                stroke="currentColor"
                strokeWidth={1}
                pointerEvents="none"
                className="text-app opacity-40"
              />
              {focus?.positions[activeStep] !== undefined && (
                <circle
                  cx={x(activeStep)}
                  cy={y(focus.positions[activeStep])}
                  r={3.5}
                  pointerEvents="none"
                  className="text-accent fill-current"
                />
              )}
            </>
          )}

          {/* x axis */}
          {steps.map((step, i) =>
            labelled.has(i) ? (
              <text
                key={i}
                x={x(i)}
                y={plotHeight + 16}
                textAnchor="middle"
                className={cx(
                  "fill-current text-[10px] tabular-nums",
                  step.kind === "match" ? "text-muted opacity-60" : "text-app opacity-80",
                )}
              >
                {stepLabel(step)}
              </text>
            ) : null,
          )}

          {/* Direct labels at each line's end — the legend, on wide screens.
              Anchored to where the lines actually stop, not to the plot edge:
              in a running championship the axis reaches into unplayed steps,
              and labels parked out there would name nothing. */}
          <g ref={labelsRef}>
            {showLabels &&
              players.map((player) => {
                const row = player.positions.at(-1);
                if (row === undefined) return null;
                return (
                  <Link
                    key={player.userId}
                    to={scoped(`/verlauf/${player.slug}`)}
                    preventScrollReset
                    aria-label={`${player.name} hervorheben`}
                    className="focus-visible:outline-accent outline-none focus-visible:outline-2"
                  >
                    {/* The glyphs alone are a poor target, especially on touch. */}
                    <rect
                      x={labelX - 3}
                      y={y(row) - ROW_HEIGHT / 2}
                      width={labelWidth}
                      height={ROW_HEIGHT}
                      fill="transparent"
                    />
                    <text
                      x={labelX}
                      y={y(row)}
                      dominantBaseline="middle"
                      className={cx(
                        "fill-current text-[11px] transition-[opacity,color] duration-150 ease-out",
                        player === focus
                          ? "text-accent font-medium"
                          : player === leader
                            ? "text-app"
                            : "text-subtle opacity-70 hover:opacity-100",
                      )}
                    >
                      {player.name}
                    </text>
                  </Link>
                );
              })}
          </g>
        </g>
      </svg>

      {/* The lines carry no text, so the focused player's run is spelled out
          for screen readers. Only theirs: one table per player would be ~60
          rows times 18, which helps nobody. */}
      {focus && (
        <table className="sr-only">
          <caption>Rangverlauf von {focus.name}</caption>
          <thead>
            <tr>
              <th scope="col">Schritt</th>
              <th scope="col">Rang</th>
              <th scope="col">Punkte</th>
            </tr>
          </thead>
          <tbody>
            {focus.ranks.map((rank, i) => {
              const step = steps[i];
              return (
                <tr key={i}>
                  <th scope="row">{step ? stepTitle(step) : `Schritt ${i + 1}`}</th>
                  <td>{rank}</td>
                  <td>{focus.points[i]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
