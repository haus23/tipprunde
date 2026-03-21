export const queryKeys = {
  users: {
    all: ["users"] as const,
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
};
