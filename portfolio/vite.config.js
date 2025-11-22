import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

let __useBackend = false;
try {
  if (import.meta && import.meta.env && import.meta.env.VITE_USE_BACKEND === 'true') {
    __useBackend = true;
  }
} catch {
  /* ignore if import.meta is unavailable */
}

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
  assetsInclude: ['**/*.png', '**/*.mp4', '**/*.MP4'],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split React and related libs into separate chunk
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Split animation libraries
          'animation-vendor': ['react-awesome-reveal', '@emotion/react'],
          // Split other third-party libraries if present
          // Add more chunking strategies as needed
        },
      },
    },
    // Increase chunk size warning limit to 1000 kB if needed
    chunkSizeWarningLimit: 1000,
  },
  server: {
    ...(__useBackend
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
