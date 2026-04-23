export const queryKeys = {
  users: {
    all: ["users"] as const,
  },
  leagues: {
    all: ["leagues"] as const,
  },
  teams: {
    all: ["teams"] as const,
  },
  rulesets: {
    all: ["rulesets"] as const,
  },
  turniere: {
    all: ["turniere"] as const,
  },
  players: {
    all: ["players"] as const,
    byChampionship: (championshipId: number) =>
      ["players", "championship", championshipId] as const,
  },
  matches: {
    byRound: (roundId: number) => ["matches", "round", roundId] as const,
  },
};
