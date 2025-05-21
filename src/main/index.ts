// MCP Config Manager main process
// Handles window creation and IPC for config management

import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';
import os from 'os';
import { format } from 'date-fns';
import winston from 'winston';

// Logger setup writes logs into user data folder
const logDir = join(app.getPath('userData'), 'logs');
const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: join(logDir, 'app.log') }),
  ],
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(import.meta.env.DEV ? 'http://localhost:5173' : `file://${join(__dirname, '../renderer/index.html')}`);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Config path resolution: attempt OS specific paths
function getConfigPath() {
  const base = process.platform === 'win32'
    ? join(os.homedir(), 'AppData', 'Roaming', 'Claude')
    : join(os.homedir(), '.config', 'Claude');
  return join(base, 'mcp.json');
}

async function readConfig() {
  const file = getConfigPath();
  try {
    const data = await fs.readFile(file, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    logger.error(`Failed to read config: ${err}`);
    throw err;
  }
}

async function writeConfig(newConfig: any) {
  const file = getConfigPath();
  const backupName = `${file}.${format(new Date(), 'yyyyMMddHHmmss')}.bak`;
  try {
    const current = await fs.readFile(file, 'utf-8');
    await fs.mkdir(logDir, { recursive: true });
    await fs.writeFile(backupName, current);
    await fs.writeFile(file, JSON.stringify(newConfig, null, 2));
  } catch (err) {
    logger.error(`Failed to write config: ${err}`);
    throw err;
  }
}

// IPC handlers
ipcMain.handle('getConfig', async () => {
  logger.info('getConfig called');
  return readConfig();
});

ipcMain.handle('setConfig', async (_evt, cfg) => {
  logger.info('setConfig called');
  // keep only enabled servers
  if (cfg.mcpServers) {
    const filtered: Record<string, any> = {};
    Object.keys(cfg.mcpServers).forEach((key) => {
      if (cfg.mcpServers[key].enabled !== false) {
        const cpy = { ...cfg.mcpServers[key] };
        delete cpy.enabled;
        filtered[key] = cpy;
      }
    });
    cfg.mcpServers = filtered;
  }
  await writeConfig(cfg);
  return true;
});

ipcMain.handle('applyConfig', async () => {
  logger.info('applyConfig called');
  // Placeholder: signal Claude to reload config
  return true;
});
