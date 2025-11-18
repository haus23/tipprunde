export type League = {
  id: string;
  name: string;
  shortname: string | null;
  createdAt: string;
  updatedAt: string;
};

export type InsertableLeague = Omit<League, "createdAt" | "updatedAt">;
export type UpdatableLeague = Omit<League, "createdAt" | "updatedAt">;
