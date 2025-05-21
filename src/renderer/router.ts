import { createRouter, createWebHashHistory } from 'vue-router';
import SettingsView from './views/SettingsView.vue';

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: SettingsView },
  ],
});
