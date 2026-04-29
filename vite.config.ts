import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { nitro } from "nitro/vite";
import { type UserConfig } from "vite-plus";

export default {
  staged: {
    "*": "vp check --fix",
  },
  lint: { options: { typeAware: true, typeCheck: true } },
  fmt: {
    ignorePatterns: [".agents/**", ".claude/**", "db/migrations/**", "src/**/*.gen.ts"],
    sortImports: {},
    sortTailwindcss: {},
  },
  plugins: [
    tailwindcss(),
    tanstackStart({
      importProtection: {
        client: {
          files: ["**/db/dal/**"],
        },
      },
      rsc: {
        enabled: true,
      },
    }),
    rsc(),
    react(),
    nitro(),
  ],
} satisfies UserConfig;
