import { defineConfig } from 'vite';
import path from 'node:path';

// Preload script Vite configuration
export default defineConfig({
  build: {
    lib: {
      entry: path.join(__dirname, 'src', 'preload', 'index.js'),
      formats: ['cjs']
    },
    outDir: path.join(__dirname, 'dist', 'preload'),
    emptyOutDir: true
  }
});
