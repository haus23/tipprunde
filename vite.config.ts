import { type UserConfig } from "vite";

import { nitro } from "nitro/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default {
  plugins: [tailwindcss(), tanstackStart(), nitro(), react()],
  resolve: {
    tsconfigPaths: true,
  },
} satisfies UserConfig;
