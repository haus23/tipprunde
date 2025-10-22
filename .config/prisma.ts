import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "../database/schema.prisma",
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
