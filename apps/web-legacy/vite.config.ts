import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import type { UserConfig } from "vite";

export default { plugins: [tailwindcss(), sveltekit()] } satisfies UserConfig;
