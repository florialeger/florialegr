import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@config': resolve(__dirname, './src/config'),
      '@assets': resolve(__dirname, './src/assets'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@ui': resolve(__dirname, './src/components/ui'),
    },
  },
  assetsInclude: ['**/*.png', '**/*.mp4'],
  server: {
    // Only enable proxying to the backend when explicitly requested via Vite env var
    // Set VITE_USE_BACKEND=true to enable the /api proxy during development.
    ...(process.env.VITE_USE_BACKEND === 'true'
      ? {
          proxy: {
            '/api': {
              target: 'http://localhost:5000', // Backend server
              changeOrigin: true,
            },
          },
        }
      : {}),
  },
});
