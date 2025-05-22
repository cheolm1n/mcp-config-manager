import { defineStore } from 'pinia';

export const useConfigStore = defineStore('config', {
  state: () => ({
    servers: [],
    raw: {},
  }),
  actions: {
    async load() {
      const data = await window.mcp.getConfig();
      this.raw = data;
      this.servers = Object.entries(data.mcpServers || {}).map(([name, def]) => ({ name, ...def, enabled: true }));
    },
    buildConfig() {
      const mcpServers = {};
      this.servers.forEach((srv) => {
        if (srv.enabled) {
          const { enabled, name, ...rest } = srv;
          mcpServers[name] = rest;
        }
      });
      return { ...this.raw, mcpServers };
    },
    async apply() {
      const cfg = this.buildConfig();
      await window.mcp.applyConfig(cfg);
    },
    async save() {
      const cfg = this.buildConfig();
      await window.mcp.setConfig(cfg);
    },
  },
});
