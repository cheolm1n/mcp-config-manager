import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS } from './ipc-channels.js';

contextBridge.exposeInMainWorld('api', {
  readConfig: (path) => ipcRenderer.invoke(IPC_CHANNELS.configRead, path || null),
  syncConfig: (data) => ipcRenderer.invoke(IPC_CHANNELS.configSync, data),
  onLoaded: (cb) => ipcRenderer.on(IPC_CHANNELS.configLoaded, (_e, d) => cb(d)),
  onError: (cb) => ipcRenderer.on(IPC_CHANNELS.configError, (_e, msg) => cb(msg)),
  onSynced: (cb) => ipcRenderer.on(IPC_CHANNELS.configSynced, (_e, n) => cb(n)),
});
// --- End of preload.js
