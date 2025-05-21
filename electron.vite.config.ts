import { defineConfig } from 'electron-vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    entry: 'src/main/index.ts',
  },
  preload: {
    // not used
  },
  renderer: {
    entry: 'src/renderer/main.ts',
    viteConfig: {
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src/renderer'),
        },
      },
    },
  },
});
