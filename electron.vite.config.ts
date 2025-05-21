import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    entry: 'src/main/index.ts',
    vite: {
      build: {
        outDir: 'dist/main'
      }
    }
  },
  renderer: {
    entry: 'src/renderer/main.ts',
    vite: {
      build: {
        outDir: 'dist/renderer'
      }
    }
  }
});
