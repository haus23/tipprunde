import type { Config } from "@react-router/dev/config";
import { vercelPreset } from "@vercel/react-router/vite";

export default {
  basename: "/manager",
  future: { v8_middleware: true },
  presets: [vercelPreset()],
} satisfies Config;
