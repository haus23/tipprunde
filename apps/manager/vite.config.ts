import { cloudflare } from "@cloudflare/vite-plugin";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { type UserConfig } from "vite";

export default {
  build: { assetsDir: "manager/assets" },
  plugins: [cloudflare({ viteEnvironment: { name: "ssr" } }), reactRouter(), tailwindcss()],
} satisfies UserConfig;
