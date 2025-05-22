/**
 * @typedef {'config:read'|'config:loaded'|'config:error'|'config:sync'|'config:synced'} IpcChannelName
 */

/**
 * @typedef {Object} IpcChannels
 * @property {string|null}  configRead
 * @property {import('./mcp.js').McpConfig} configLoaded
 * @property {string}       configError
 * @property {import('./mcp.js').McpConfig} configSync
 * @property {number}       configSynced
 */
// --- End of ipc.js
