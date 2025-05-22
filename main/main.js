import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { mkdir, stat } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { IPC_CHANNELS } from './ipc-channels.js';

let mainWindow;
let currentPath;

function getDefaultPath() {
  return join(app.getPath('appData'), 'ClaudeDesktop', 'mcp.json');
}

async function ensureDir(filePath) {
  try {
    await stat(dirname(filePath));
  } catch {
    await mkdir(dirname(filePath), { recursive: true });
  }
}

async function loadConfig(filePath) {
  const target = filePath || getDefaultPath();
  try {
    const data = JSON.parse(await readFile(target, 'utf8'));
    currentPath = target;
    mainWindow.webContents.send(IPC_CHANNELS.configLoaded, { path: target, data });
  } catch (e) {
    mainWindow.webContents.send(IPC_CHANNELS.configError, e.message);
  }
}

async function syncConfig(data) {
  if (!currentPath) return;
  try {
    await ensureDir(currentPath);
    const backup = join(
      dirname(currentPath),
      `.backup_${new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14)}.json`,
    );
    await copyFile(currentPath, backup);
    const active = data.filter((m) => m.enabled);
    await writeFile(currentPath, JSON.stringify(active, null, 2));
    mainWindow.webContents.send(IPC_CHANNELS.configSynced, active.length);
  } catch (e) {
    mainWindow.webContents.send(IPC_CHANNELS.configError, e.message);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, 'preload.js'),
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(join(app.getAppPath(), 'renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();
  ipcMain.handle(IPC_CHANNELS.configRead, (_, p) => loadConfig(p));
  ipcMain.handle(IPC_CHANNELS.configSync, (_, data) => syncConfig(data));
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
// --- End of main.js
