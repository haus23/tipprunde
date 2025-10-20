import type { UserConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import devtoolsJson from "vite-plugin-devtools-json";

export default {
  plugins: [reactRouter(), devtoolsJson()],
} satisfies UserConfig;
