import { cloudflare } from "@cloudflare/vite-plugin";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { type UserConfig } from "vite";

export default {
  plugins: [
    { ...optimizeLocales.vite({ locales: ["de-DE"] }), enforce: "pre" },
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart(),
    react(),
  ],
} satisfies UserConfig;
