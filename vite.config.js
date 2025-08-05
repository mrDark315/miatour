import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/',
    build: {
        rollupOptions: {
            input: {
                index: resolve(__dirname, 'index.html'),
                countries: resolve(__dirname, 'countries.html'),
                hotels: resolve(__dirname, 'hotels.html')
            },
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            }
        }
    },
    publicDir: 'public'
});