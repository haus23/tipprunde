import type { UserConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import devtoolsJson from "vite-plugin-devtools-json";

export default {
  plugins: [tsconfigPaths(), reactRouter(), devtoolsJson()],
} satisfies UserConfig;
