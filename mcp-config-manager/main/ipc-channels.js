/**
 * @typedef {'config:read'|'config:loaded'|'config:error'|'config:sync'|'dialog:openFile'} IpcChannelName
 *  // Removed 'config:synced' as sync operation will return promise
 */

/**
 * @typedef {Object} IpcChannels
 * @property {(filePath: string|null) => Promise<void>} configRead
 * @property {(callback: (data: { config: McpConfig, filePath: string }) => void) => void} onConfigLoaded // Updated to reflect actual payload
 * @property {(callback: (errorMessage: string) => void) => void} onConfigError
 * @property {(configToSync: McpConfig) => Promise<number>} configSync // Returns count of synced items or throws error
 * @property {() => Promise<string|null>} dialogOpenFile
 */

// Note: McpConfig will be defined in src/types/mcp.js
// For now, this file defines the channel names and the expected structure of the API exposed via contextBridge.

module.exports = {}; // Not strictly necessary for JSDoc types, but good practice for a .js file.
// --- End of main/ipc-channels.js
