
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages configuration for ToxicTide
export default defineConfig({
    plugins: [react()],
    base: '/ToxicTide/',
});
