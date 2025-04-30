import {defineConfig} from 'vite';

// Plugins
import {reactRouter} from '@react-router/dev/vite';
import {cloudflare} from "@cloudflare/vite-plugin";
import tailwindCss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [cloudflare({ viteEnvironment: { name: 'ssr' }}), tailwindCss(), reactRouter()],
})
