import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Polyfills for Node.js core modules
            https: 'https-browserify',
            querystring: 'querystring-es3',
            url: 'url',
            stream: 'stream-browserify',
            buffer: 'buffer/',
        },
    },
    define: {
        'process.env': {},
        global: {},
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000',
        },
    },
});
