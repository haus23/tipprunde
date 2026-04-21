import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { nitro } from "nitro/vite";
import { type UserConfig } from "vite";

export default {
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
