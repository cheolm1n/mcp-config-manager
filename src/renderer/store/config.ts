import { defineStore } from 'pinia';
import { ipcRenderer } from 'electron';
import { reactive } from 'vue';

export const useConfigStore = defineStore('config', () => {
  const config = reactive<any>({});
  const servers = reactive<Record<string, any>>({});

  async function load() {
    const data = await ipcRenderer.invoke('getConfig');
    Object.assign(config, data);
    if (data.mcpServers) {
      Object.entries(data.mcpServers).forEach(([key, val]: [string, any]) => {
        servers[key] = { ...val, enabled: true };
      });
    }
  }

  async function apply() {
    await ipcRenderer.invoke('applyConfig');
  }

  async function save() {
    const cfg = { ...config, mcpServers: { ...servers } };
    await ipcRenderer.invoke('setConfig', cfg);
  }

  return { config, servers, load, apply, save };
});
