/**
 * vite.config.js
 * 
 * Vite configuration for the React frontend.
 * Configures the React plugin and the dev server proxy
 * so that API requests to /api are forwarded to the Express backend.
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
