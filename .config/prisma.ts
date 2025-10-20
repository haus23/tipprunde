import type { PrismaConfig } from "prisma";
import "dotenv/config";

export default {
  schema: "../database/schema.prisma",
} satisfies PrismaConfig;
