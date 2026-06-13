import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    sortImports: {},
    sortTailwindcss: {},
    ignorePatterns: ["routeTree.gen.ts", "**/.svelte-kit/**"],
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  staged: {
    "*": "vp check --fix",
  },
});
