import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

export default {
  server: { port: 5175 },
  plugins: [tailwindcss(), sveltekit()],
} satisfies UserConfig;
