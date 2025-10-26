import { PrismaLibSQL } from "@prisma/adapter-libsql";

import { PrismaClient } from "../prisma/client";
import { singleton } from "../singleton.server";
import { env } from "../env.server";

const adapter = new PrismaLibSQL({
  url: env.DATABASE_URL,
});

export const db = singleton("prisma", () =>
  new PrismaClient({ adapter }).$extends({
    result: {
      user: {
        isManager: {
          needs: { role: true },
          compute: (user) => ["MANAGER", "ADMIN"].includes(user.role),
        },
        isAdmin: {
          needs: { role: true },
          compute: (user) => user.role === "ADMIN",
        },
      },
    },
  }),
);
