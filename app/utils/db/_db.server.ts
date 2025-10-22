import { PrismaClient } from "../prisma/client";
import { singleton } from "../singleton.server";

export const db = singleton("prisma", () =>
  new PrismaClient().$extends({
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
