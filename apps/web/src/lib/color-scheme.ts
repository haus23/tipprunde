import { createServerFn } from "@tanstack/react-start";
import { deleteCookie, setCookie } from "@tanstack/react-start/server";

import type { ColorScheme } from "./session.ts";

export const setColorScheme = createServerFn({ method: "POST" })
  .validator((scheme: ColorScheme) => scheme)
  .handler(({ data }) => {
    // "system" is the default — drop the cookie so absence means system
    if (data === "system") {
      deleteCookie("__color-scheme");
      return;
    }
    setCookie("__color-scheme", data, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  });
