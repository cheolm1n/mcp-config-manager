import { defineStore } from 'pinia';

/**
 * @typedef {import('../types/mcp.js').MCP} MCP
 * @typedef {import('../types/mcp.js').McpConfig} McpConfig
 */

export const useMcpStore = defineStore('mcp', {
  state: () => ({
    mcps: /** @type {McpConfig} */ ([]),
    path: '',
  }),
  actions: {
    set(list) {
      this.mcps = list;
    },
    toggle(id) {
      const item = this.mcps.find((m) => m.id === id);
      if (item) item.enabled = !item.enabled;
    },
    setPath(p) {
      this.path = p;
    },
  },
});
// --- End of mcp.js
