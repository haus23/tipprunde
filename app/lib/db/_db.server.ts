import { PrismaBetterSQLite3 } from "@prisma/adapter-better-sqlite3";

import { singleton } from "~/utils/singleton.server";
import { PrismaClient } from "./prisma/client";
import { env } from "~/utils/env.server";

const adapter = new PrismaBetterSQLite3({
  url: env.DATABASE_URL,
});

export const db = singleton("prisma", () => new PrismaClient({ adapter }));
