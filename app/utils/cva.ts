import { defineConfig } from "cva";
import { twMerge } from "tailwind-merge";

// Re-export types
export type { VariantProps } from "cva";

// Rollout custome cva functions
export const { cva, cx, compose } = defineConfig({
  hooks: {
    onComplete: (className) => twMerge(className),
  },
});
