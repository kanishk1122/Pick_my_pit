import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import path module

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
  },
  resolve: {
    alias: {
      '@utils': path.resolve( './src/utils'), // Map @utils to src/utils
      '@CSS' : path.resolve('./src/assets/CSS'),
      '@Consts': path.resolve('./src/Consts'),
    },
  },
});
