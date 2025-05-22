const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Config related IPC
  configRead: (filePath) => ipcRenderer.invoke('config:read', filePath),
  /**
   * @param {(config: import('../src/types/mcp.js').McpConfig, filePath: string) => void} callback
   */
  onConfigLoaded: (callback) => ipcRenderer.on('config:loaded', (_event, { config, filePath }) => callback(config, filePath)),
  onConfigError: (callback) => ipcRenderer.on('config:error', (_event, errorMessage) => callback(errorMessage)),
  
  configSync: (configToSync) => ipcRenderer.invoke('config:sync', configToSync), // Returns a Promise

  dialogOpenFile: () => ipcRenderer.invoke('dialog:openFile'),
  // Removed onConfigSynced as configSync will return a Promise

  // It's good practice to remove listeners, though for global app listeners it might not be strictly necessary
  // depending on the app's lifecycle. For now, we'll keep it simple.
  // Example: removeListener: (channel, callback) => ipcRenderer.removeListener(channel, callback)
  // This would require users of onConfigLoaded etc. to keep a reference to their callback.
});
// --- End of main/preload.js
