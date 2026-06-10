import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { type UserConfig } from "vite";

export default {
  plugins: [tailwindcss(), tanstackStart(), react()],
} satisfies UserConfig;
