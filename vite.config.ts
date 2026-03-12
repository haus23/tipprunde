import { type UserConfig } from "vite";

import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

export default {
  plugins: [tailwindcss(), tanstackStart(), react()],
  resolve: {
    tsconfigPaths: true,
  },
} satisfies UserConfig;
