import {defineConfig} from 'vite';

// Plugins
import {reactRouter} from '@react-router/dev/vite';
import {cloudflare} from "@cloudflare/vite-plugin";

export default defineConfig({
    plugins: [cloudflare({ viteEnvironment: { name: 'ssr' }}), reactRouter()],
})
