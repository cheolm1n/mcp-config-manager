import { defineConfig } from 'vite';
import path from 'node:path';

// Main process Vite configuration
export default defineConfig({
  build: {
    lib: {
      entry: path.join(__dirname, 'src', 'main', 'index.js'),
      formats: ['cjs']
    },
    outDir: path.join(__dirname, 'dist', 'main'),
    emptyOutDir: true
  }
});
