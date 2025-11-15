export type Championship = {
  id: string;
  name: string;
  nr: number;
  ruleId: string;
  published?: number;
  completed?: number;
  extraPointsPublished?: number;
  createdAt: string;
  updatedAt: string;
};

export type InsertableChampionship = Omit<
  Championship,
  "createdAt" | "updatedAt"
>;
export type UpdatableChampionship = Omit<
  Championship,
  "createdAt" | "updatedAt"
>;
