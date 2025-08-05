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
    publicDir: 'public'
});