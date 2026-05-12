import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite-plus";

export default { plugins: [tailwindcss(), sveltekit()] } satisfies UserConfig;
