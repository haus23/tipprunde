import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => {
  return {
    plugins: [reactRouter()],
    build: {
      rollupOptions: isSsrBuild
        ? {
            input: './workers/app.ts',
          }
        : undefined,
    },
  };
});
