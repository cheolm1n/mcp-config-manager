/**
 * @typedef {'config:read'|'config:loaded'|'config:error'|'config:sync'|'config:synced'} IpcChannelName
 */

/**
 * @typedef {Object} IpcChannels
 * @property {string|null}  configRead
 * @property {import('../src/types/mcp.js').McpConfig} configLoaded
 * @property {string}       configError
 * @property {import('../src/types/mcp.js').McpConfig} configSync
 * @property {number}       configSynced
 */

export const IPC_CHANNELS = {
  configRead: 'config:read',
  configLoaded: 'config:loaded',
  configError: 'config:error',
  configSync: 'config:sync',
  configSynced: 'config:synced',
};
// --- End of ipc-channels.js
