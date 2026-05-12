import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    sortImports: {},
    sortTailwindcss: {},
    ignorePatterns: ["**/.svelte-kit/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  staged: {
    "*": "vp check --fix",
  },
});
