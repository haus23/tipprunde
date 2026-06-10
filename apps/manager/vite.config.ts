import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { type UserConfig } from "vite";

export default {
  build: { assetsDir: "manager/assets" },
  plugins: [reactRouter(), tailwindcss()],
} satisfies UserConfig;
