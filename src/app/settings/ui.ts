import { createServerFn } from "@tanstack/react-start";
import { updateSession, useSession } from "@tanstack/react-start/server";

import { env } from "#/utils/env.server.ts";

export type ColorScheme = "light" | "dark" | "system";

type UISettings = {
  colorScheme: ColorScheme;
};

const defaultUISettings: UISettings = {
  colorScheme: "system",
};

const cookieConfig = {
  name: "ui",
  password: env.APP_SECRET,
  cookie: {
    httpOnly: true,
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24 * 365,
  },
};

async function getUISession() {
  return useSession<UISettings>(cookieConfig);
}

export const getUISettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await getUISession();
  return { ...defaultUISettings, ...session.data };
});

export const updateUISettingsFn = createServerFn({ method: "POST" })
  .inputValidator((data: Partial<UISettings>) => data)
  .handler(async ({ data }) => {
    const session = await getUISession();
    await updateSession(cookieConfig, { ...session.data, ...data });
  });
