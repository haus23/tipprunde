import { cx } from "@tipprunde/ui";
import { useEffect, useRef, useState } from "react";

import type { VerlaufPlayer, VerlaufStep } from "#/lib/verlauf.server.ts";

const ROW_HEIGHT = 22;
const MARGIN = { top: 10, right: 8, bottom: 24, left: 8 };
/** Reserved for the right-edge name labels — only claimed when they show. */
const LABEL_WIDTH = 92;
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

  const showLabels = width >= LABEL_BREAKPOINT;
  const plotWidth = Math.max(
    0,
    width - MARGIN.left - MARGIN.right - (showLabels ? LABEL_WIDTH : 0),
  );
  const plotHeight = players.length * ROW_HEIGHT;
  const height = plotHeight + MARGIN.top + MARGIN.bottom;

  const x = (stepIndex: number) =>
    steps.length > 1 ? (stepIndex / (steps.length - 1)) * plotWidth : plotWidth / 2;
  const y = (row: number) => row * ROW_HEIGHT + ROW_HEIGHT / 2;

  const leader = players[0];
  const focus = players.find((p) => p.slug === focusSlug);

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

  return (
    <div ref={ref} className="w-full">
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={
          `Punkteverlauf: Rangentwicklung von ${players.length} Spielern über ` +
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

          {/* Rule line wherever points arrive outside a match, so an RP or ZP
              column is still marked even when its label lost the space. */}
          {steps.map((step, i) =>
            step.kind === "match" ? null : (
              <line
                key={`rule-${i}`}
                x1={x(i)}
                x2={x(i)}
                y1={0}
                y2={plotHeight}
                stroke="currentColor"
                strokeWidth={1}
                className="text-subtle opacity-25"
              />
            ),
          )}

          {/* Context layer: everyone who is neither focused nor leading. */}
          {players.map((player) =>
            player === focus || player === leader ? null : (
              <polyline
                key={player.userId}
                points={line(player)}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-subtle opacity-30"
              />
            ),
          )}

          {/* Reference layer: the leader, unless they are already the focus. */}
          {leader && leader !== focus && (
            <polyline
              points={line(leader)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-app opacity-70"
            />
          )}

          {/* Focus layer, drawn last so it wins every crossing. */}
          {focus && (
            <polyline
              points={line(focus)}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            />
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
          {showLabels &&
            players.map((player) => {
              const row = player.positions.at(-1);
              if (row === undefined) return null;
              return (
                <text
                  key={player.userId}
                  x={x(Math.max(0, playedSteps - 1)) + 6}
                  y={y(row)}
                  dominantBaseline="middle"
                  className={cx(
                    "fill-current text-[11px]",
                    player === focus
                      ? "text-accent font-medium"
                      : player === leader
                        ? "text-app"
                        : "text-subtle opacity-70",
                  )}
                >
                  {player.name}
                </text>
              );
            })}
        </g>
      </svg>
    </div>
  );
}
