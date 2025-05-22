import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  main: {
    entry: 'main/main.js',
  },
  preload: {
    input: {
      preload: 'main/preload.js',
    },
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          main: 'index.html',
        },
      },
    },
    plugins: [vue()],
  },
});
// --- End of electron.vite.config.js
