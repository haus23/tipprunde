import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { type UserConfig } from "vite";

export default {
  build: { assetsDir: "manager/assets" },
  server: { port: 5174 },
  plugins: [reactRouter(), tailwindcss()],
} satisfies UserConfig;
