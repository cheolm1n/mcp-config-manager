/**
 * Defines the available IPC channel names.
 * These should correspond to the channels handled in main.js and exposed in preload.js.
 * @typedef {'config:read'|'config:loaded'|'config:error'|'config:sync'|'config:synced'|'dialog:openFile'} IpcChannelName
 */

/**
 * Describes the structure of the API exposed to the renderer process via contextBridge.
 * This helps with type checking and autocompletion in the renderer code.
 *
 * @typedef {Object} ExposedApi
 * @property {(filePath?: string | null) => Promise<void>} configRead
 *   - Invokes reading of the configuration file.
 *   - If filePath is null or undefined, attempts to load from the default path.
 * @property {(callback: (config: import('./mcp.js').McpConfig) => void) => void} onConfigLoaded
 *   - Registers a listener for when MCP configuration is successfully loaded.
 *   - The callback receives the McpConfig array.
 * @property {(callback: (errorMessage: string) => void) => void} onConfigError
 *   - Registers a listener for errors that occur during configuration loading or synchronization.
 * @property {(configToSync: import('./mcp.js').McpConfig) => Promise<number | null>} configSync
 *   - Sends the current MCP configuration (typically filtered for active MCPs) to the main process to be written to disk.
 *   - Returns a Promise that resolves with the number of synced MCPs, or null if an error occurred.
 * @property {(callback: (syncedMcpCount: number) => void) => void} onConfigSynced
 *   - Registers a listener for when the configuration has been successfully synced to disk.
 *   - The callback receives the count of MCPs that were written.
 * @property {() => Promise<string | null>} dialogOpenFile
 *   - Invokes a main process dialog to select a JSON file.
 *   - Returns a Promise that resolves with the selected file path, or null if the dialog was canceled.
 */

// This file is for JSDoc type definitions.
// It references McpConfig from './mcp.js' to ensure type consistency.
module.exports = {};
// --- End of src/types/ipc.js
