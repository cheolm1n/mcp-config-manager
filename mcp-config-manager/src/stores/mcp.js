import { defineStore } from 'pinia';

/**
 * @typedef {import('../types/mcp.js').MCP} MCP
 * @typedef {import('../types/mcp.js').McpConfig} McpConfig
 */

export const useMcpStore = defineStore('mcp', {
  state: () => ({
    /** @type {McpConfig} */
    mcpConfig: [],
    currentConfigPath: '', // To store the path of the loaded mcp.json
    error: null,           // To store any error messages
    isLoading: false,      // To indicate if config is being loaded/synced
  }),
  getters: {
    /** @returns {McpConfig} */
    enabledMcps: (state) => state.mcpConfig.filter(mcp => mcp.enabled),
    /** @returns {number} */
    enabledMcpsCount: (state) => state.mcpConfig.filter(mcp => mcp.enabled).length,
  },
  actions: {
    /** @param {McpConfig} config */
    setMcpConfig(config) {
         // Ensure 'enabled' property is a boolean for all items
         // and provide default values for other properties if they might be missing.
         this.mcpConfig = config.map(mcp => ({
           id: mcp.id || `unknown-id-${Date.now()}-${Math.random()}`, // Basic fallback for ID
           name: mcp.name || 'Unknown Name',
           description: mcp.description || '',
           version: mcp.version || '0.0.0',
           enabled: !!mcp.enabled, // Explicit boolean conversion
         }));
      this.error = null; // Clear previous errors
    },
    /** @param {string} path */
    setCurrentConfigPath(path) {
      this.currentConfigPath = path;
    },
    /** @param {string | null} errorMessage */
    setError(errorMessage) {
      this.error = errorMessage;
    },
    /** @param {boolean} loading */
    setLoading(loading) {
      this.isLoading = loading;
    },
    /**
     * Toggles the enabled state of an MCP by its ID.
     * @param {string} mcpId The ID of the MCP to toggle.
     */
    toggleMcpEnabled(mcpId) {
      const mcp = this.mcpConfig.find(m => m.id === mcpId);
      if (mcp) {
        mcp.enabled = !mcp.enabled;
      }
    },
    // Action to update an MCP's enabled status, useful if direct v-model is not preferred for some reason
    // updateMcpEnabledStatus(mcpId, enabled) {
    //   const mcp = this.mcpConfig.find(m => m.id === mcpId);
    //   if (mcp) {
    //     mcp.enabled = enabled;
    //   }
    // }
  },
});
// --- End of src/stores/mcp.js
