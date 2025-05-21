// Preload script exposing IPC handlers
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mcp', {
  getConfig: () => ipcRenderer.invoke('getConfig'),
  setConfig: (cfg) => ipcRenderer.invoke('setConfig', cfg),
  applyConfig: () => ipcRenderer.invoke('applyConfig'),
});
