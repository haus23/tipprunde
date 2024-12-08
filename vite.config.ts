import { defineConfig } from 'vite';

import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [tailwindcss(), reactRouter()],
    build: {
      rollupOptions: isSsrBuild
        ? {
            input: './workers/app.ts',
          }
        : undefined,
    },
  };
});
