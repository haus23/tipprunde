export type Team = {
  id: string;
  name: string;
  shortname: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InsertableTeam = Omit<Team, "createdAt" | "updatedAt">;
export type UpdatableTeam = Omit<Team, "createdAt" | "updatedAt">;
