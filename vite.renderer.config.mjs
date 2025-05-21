import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

// Renderer Vite configuration
export default defineConfig({
  plugins: [vue()],
  root: path.join(__dirname, 'src', 'renderer'),
  build: {
    outDir: path.join(__dirname, 'dist', 'renderer'),
    emptyOutDir: true
  }
});
