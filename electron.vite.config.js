import { defineConfig } from 'electron-vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  main: {
    build: {
      lib: { entry: 'main/main.js' },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: 'main/preload.js',
        },
      },
    },
  },
  renderer: {
    input: 'index.html',
    plugins: [vue()],
  },
});
// --- End of electron.vite.config.js
