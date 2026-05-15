import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  basename: "/manager/",
  presets: [vercelPreset()],
} satisfies Config;
