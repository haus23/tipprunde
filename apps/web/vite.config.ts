import { cloudflare } from "@cloudflare/vite-plugin";
import optimizeLocales from "@react-aria/optimize-locales-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { type UserConfig } from "vite";

export default {
  plugins: [
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    reactRouter(),
    tailwindcss(),
    // React Aria ships translations for 34 locales; the app is German-only
    // (`I18nProvider locale="de-DE"`), so the rest are dead weight in the
    // client bundle. Client-only by design — the plugin skips SSR.
    { ...optimizeLocales.vite({ locales: ["de-DE"] }), enforce: "pre" },
  ],
} satisfies UserConfig;
