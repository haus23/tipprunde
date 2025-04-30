import { cloudflare } from '@cloudflare/vite-plugin';

// Plugins
import { reactRouter } from '@react-router/dev/vite';
import tailwindCss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindCss(),
    reactRouter(),
  ],
});
