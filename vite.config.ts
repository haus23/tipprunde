import type { UserConfig } from "vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";

export default {
  plugins: [tsConfigPaths(), tanstackStart(), react()],
} satisfies UserConfig;
