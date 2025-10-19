import type { UserConfig } from "vite";

import { unstable_reactRouterRSC as reactRouter } from "@react-router/dev/vite";
import rsc from "@vitejs/plugin-rsc";
import devtoolsJson from "vite-plugin-devtools-json";

export default {
  plugins: [reactRouter(), rsc(), devtoolsJson()],
} satisfies UserConfig;
