import { createServerFn } from "@tanstack/react-start";
import { updateSession, useSession } from "@tanstack/react-start/server";

import { env } from "#/utils/env.server.ts";

export type ManagerShellSettings = {
  sidebarCollapsed: boolean;
  activeSlug?: string;
};

const defaultManagerShellSettings: ManagerShellSettings = {
  sidebarCollapsed: false,
};

const cookieConfig = {
  name: "manager-shell",
  password: env.APP_SECRET,
  cookie: {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 365,
  },
};

async function getManagerShellSession() {
  return useSession<ManagerShellSettings>(cookieConfig);
}

export const getManagerShellSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getManagerShellSession();
  return { ...defaultManagerShellSettings, ...session.data };
});

export const updateManagerShellSettingsFn = createServerFn({ method: "POST" })
  .inputValidator((data: Partial<ManagerShellSettings>) => data)
  .handler(async ({ data }) => {
    const session = await getManagerShellSession();
    await updateSession(cookieConfig, { ...session.data, ...data });
  });
