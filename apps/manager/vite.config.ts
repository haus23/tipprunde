import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/manager/",
  server: { port: 5174 },
  plugins: [reactRouter(), tailwindcss()],
});
