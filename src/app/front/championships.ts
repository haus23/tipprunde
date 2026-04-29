import { createServerFn } from "@tanstack/react-start";

import { getLatestPublishedChampionship } from "#db/dal/championships.ts";

export const fetchCurrentChampionshipFn = createServerFn({ method: "GET" }).handler(() =>
  getLatestPublishedChampionship(),
);
