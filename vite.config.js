import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: './',
    build: {
        rollupOptions: {
        input: {
            main: resolve(__dirname, 'index.html'),
            // about: resolve(__dirname, 'src/pages/countries.html'),
            // about: resolve(__dirname, 'src/pages/hotels.html')
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