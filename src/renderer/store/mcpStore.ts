import { defineStore } from 'pinia';

export const useMcpStore = defineStore('mcp', {
  actions: {
    async apply(servers: Record<string, any>) {
      const cfg = { mcpServers: servers };
      await window.mcpAPI.applyConfig(cfg);
    },
    async save(baseConfig: any, servers: Record<string, any>) {
      const cfg = { ...baseConfig, mcpServers: servers };
      await window.mcpAPI.setConfig(cfg);
    },
  },
});
