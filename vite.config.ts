import { defineConfig } from 'vite';

// Plugins

import { cloudflare } from '@cloudflare/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindCss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    devtoolsJson(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindCss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
