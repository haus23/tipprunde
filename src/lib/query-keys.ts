export const queryKeys = {
  users: {
    all: ["users"] as const,
  },
  players: {
    all: ["players"] as const,
    byChampionship: (championshipId: number) =>
      ["players", "championship", championshipId] as const,
  },
};
