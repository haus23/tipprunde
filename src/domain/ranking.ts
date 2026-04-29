export type RankEntry = { userId: number; points: number; rank: number };

export function computeRanking(players: { userId: number; points: number }[]): RankEntry[] {
  const sorted = [...players].sort((a, b) => b.points - a.points);
  let rank = 1;
  return sorted.map((player, index) => {
    if (index > 0 && player.points < sorted[index - 1].points) rank = index + 1;
    return { ...player, rank };
  });
}
