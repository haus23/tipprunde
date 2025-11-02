import type { UserConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import devtoolsJson from "vite-plugin-devtools-json";
import tsconfigPaths from "vite-tsconfig-paths";

export default {
  plugins: [tailwindcss(), tsconfigPaths(), reactRouter(), devtoolsJson()],
} satisfies UserConfig;
