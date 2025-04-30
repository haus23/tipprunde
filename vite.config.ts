import {defineConfig} from 'vite';

// Plugins
import {reactRouter} from '@react-router/dev/vite';

export default defineConfig({
    plugins: [reactRouter()],
})
