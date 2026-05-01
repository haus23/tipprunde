"use client";

import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { useCallback } from "react";

const MARGIN = { top: 16, right: 16, bottom: 36, left: 48 };
const HEIGHT = 400;

const PLAYER_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#84cc16",
  "#14b8a6",
  "#a855f7",
  "#0ea5e9",
];

export interface PlayerData {
  userId: number;
  name: string;
}

export interface SnapshotData {
  matchNr: number;
  entries: { userId: number; points: number; rank: number }[];
}

type TooltipEntry = { name: string; points: number; rank: number; color: string };
type TooltipData = { matchNr: number; entries: TooltipEntry[] };

function Chart({
  width,
  players,
  snapshots,
}: {
  width: number;
  players: PlayerData[];
  snapshots: SnapshotData[];
}) {
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop, tooltipOpen } =
    useTooltip<TooltipData>();

  const innerWidth = Math.max(0, width - MARGIN.left - MARGIN.right);
  const innerHeight = Math.max(0, HEIGHT - MARGIN.top - MARGIN.bottom);

  const matchNrs = snapshots.map((s) => s.matchNr);
  const maxPoints = Math.max(0, ...snapshots.flatMap((s) => s.entries.map((e) => e.points)));

  const xScale = scalePoint({ domain: matchNrs, range: [0, innerWidth], padding: 0.05 });
  const yScale = scaleLinear({ domain: [0, maxPoints], range: [innerHeight, 0], nice: true });

  // Show at most one tick per ~28px to avoid overlap
  const tickEvery = Math.max(1, Math.ceil(matchNrs.length / (innerWidth / 28)));
  const xTickValues = matchNrs.filter((_, i) => i % tickEvery === 0);

  const series = players.map((player, i) => ({
    userId: player.userId,
    name: player.name,
    color: PLAYER_COLORS[i % PLAYER_COLORS.length],
    data: snapshots.map((s) => ({
      matchNr: s.matchNr,
      points: s.entries.find((e) => e.userId === player.userId)?.points ?? 0,
    })),
  }));

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<SVGRectElement>) => {
      const point = localPoint(event);
      if (!point || !matchNrs.length) return;
      const mouseX = point.x - MARGIN.left;

      let closestNr = matchNrs[0];
      let closestDist = Infinity;
      for (const nr of matchNrs) {
        const dist = Math.abs((xScale(nr) ?? 0) - mouseX);
        if (dist < closestDist) {
          closestDist = dist;
          closestNr = nr;
        }
      }

      const snapshot = snapshots.find((s) => s.matchNr === closestNr);
      if (!snapshot) return;

      const entries: TooltipEntry[] = players
        .map((p, i) => {
          const entry = snapshot.entries.find((e) => e.userId === p.userId);
          return {
            name: p.name,
            points: entry?.points ?? 0,
            rank: entry?.rank ?? 0,
            color: PLAYER_COLORS[i % PLAYER_COLORS.length],
          };
        })
        .sort((a, b) => a.rank - b.rank);

      showTooltip({
        tooltipData: { matchNr: closestNr, entries },
        tooltipLeft: (xScale(closestNr) ?? 0) + MARGIN.left,
        tooltipTop: MARGIN.top,
      });
    },
    [matchNrs, xScale, snapshots, players, showTooltip],
  );

  if (width < 10) return null;

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={HEIGHT}>
        <Group left={MARGIN.left} top={MARGIN.top}>
          <GridRows
            scale={yScale}
            width={innerWidth}
            strokeDasharray="3,3"
            stroke="currentColor"
            strokeOpacity={0.15}
          />
          {series.map((s) => (
            <LinePath
              key={s.userId}
              data={s.data}
              x={(d) => xScale(d.matchNr) ?? 0}
              y={(d) => yScale(d.points)}
              stroke={s.color}
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {tooltipOpen && tooltipData && (
            <line
              x1={xScale(tooltipData.matchNr) ?? 0}
              x2={xScale(tooltipData.matchNr) ?? 0}
              y1={0}
              y2={innerHeight}
              stroke="currentColor"
              strokeOpacity={0.25}
              strokeWidth={1}
              pointerEvents="none"
            />
          )}
          <AxisBottom
            top={innerHeight}
            scale={xScale}
            tickValues={xTickValues}
            tickLength={4}
            hideAxisLine
            tickStroke="currentColor"
            tickLabelProps={{
              fill: "currentColor",
              fontSize: 11,
              textAnchor: "middle",
              opacity: 0.5,
            }}
          />
          <AxisLeft
            scale={yScale}
            tickLength={0}
            hideAxisLine
            tickLabelProps={{
              fill: "currentColor",
              fontSize: 11,
              textAnchor: "end",
              dx: -4,
              dy: 3,
              opacity: 0.5,
            }}
          />
          {/* Transparent overlay to capture mouse events */}
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleMouseMove}
            onMouseLeave={hideTooltip}
          />
        </Group>
      </svg>
      {tooltipOpen && tooltipData && (
        <TooltipWithBounds
          key={tooltipData.matchNr}
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            position: "absolute",
            background: "var(--background-color-base)",
            border: "1px solid var(--border-color-input)",
            borderRadius: 6,
            padding: "8px 10px",
            fontSize: 12,
            lineHeight: 1.7,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            pointerEvents: "none",
            minWidth: 160,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>Spiel {tooltipData.matchNr}</div>
          {tooltipData.entries.map((e) => (
            <div key={e.name} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
              <span style={{ color: e.color, fontSize: 10 }}>●</span>
              <span style={{ opacity: 0.45, minWidth: "2.5ch" }}>P{e.rank}</span>
              <span style={{ flex: 1 }}>{e.name}</span>
              <span style={{ paddingLeft: 12, fontVariantNumeric: "tabular-nums" }}>
                {e.points}
              </span>
            </div>
          ))}
        </TooltipWithBounds>
      )}
    </div>
  );
}

interface PunkteverlaufChartProps {
  players: PlayerData[];
  snapshots: SnapshotData[];
}

export function PunkteverlaufChart({ players, snapshots }: PunkteverlaufChartProps) {
  return (
    <div className="w-full">
      <div className="xs:mx-0 mx-4 mb-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {players.map((p, i) => (
          <div key={p.userId} className="flex items-center gap-1.5 text-xs">
            <span
              style={{
                display: "inline-block",
                width: 20,
                height: 2,
                borderRadius: 1,
                backgroundColor: PLAYER_COLORS[i % PLAYER_COLORS.length],
              }}
            />
            {p.name}
          </div>
        ))}
      </div>
      <ParentSize>
        {({ width }) => <Chart width={width} players={players} snapshots={snapshots} />}
      </ParentSize>
    </div>
  );
}
