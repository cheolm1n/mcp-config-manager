// Preload script exposes safe IPC APIs to renderer
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('mcpAPI', {
  getConfig: () => ipcRenderer.invoke('getConfig'),
  setConfig: (data: any) => ipcRenderer.invoke('setConfig', data),
  applyConfig: () => ipcRenderer.invoke('applyConfig'),
});
