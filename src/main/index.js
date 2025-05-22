// Main process entry for MCP Config Manager
// Handles window creation and configuration IPC
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import fs from 'fs-extra';
import { createLogger, format, transports } from 'winston';
import { autoUpdater } from 'electron-updater';

const logDir = path.join(app.getPath('userData'), 'logs');
fs.ensureDirSync(logDir);
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => `${timestamp} [${level}] ${message}`),
  ),
  transports: [new transports.File({ filename: path.join(logDir, 'app.log') })],
});

let mainWindow;

function getConfigPath() {
  const base = path.join(app.getPath('appData'), 'Claude');
  return path.join(base, 'mcp_config.json');
}

async function readConfig() {
  const cfgPath = getConfigPath();
  try {
    return await fs.readJson(cfgPath);
  } catch (err) {
    logger.error(`readConfig failed: ${err}`);
    return {};
  }
}

async function writeConfig(cfg) {
  const cfgPath = getConfigPath();
  await fs.ensureDir(path.dirname(cfgPath));
  if (await fs.pathExists(cfgPath)) {
    const backup = `${cfgPath}.${Date.now()}.bak`;
    await fs.copy(cfgPath, backup);
  }
  await fs.writeJson(cfgPath, cfg, { spaces: 2 });
}

function filterEnabledServers(cfg) {
  const servers = cfg.mcpServers || {};
  const filtered = {};
  Object.entries(servers).forEach(([name, def]) => {
    if (def.enabled !== false) {
      const { enabled, ...rest } = def;
      filtered[name] = rest;
    }
  });
  return { ...cfg, mcpServers: filtered };
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.handle('getConfig', async () => readConfig());
  ipcMain.handle('setConfig', async (event, cfg) => {
    const filtered = filterEnabledServers(cfg);
    await writeConfig(filtered);
    return true;
  });
  ipcMain.handle('applyConfig', async () => {
    logger.info('applyConfig invoked');
    return true;
  });

  autoUpdater.checkForUpdatesAndNotify().catch((e) => logger.error(e));

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

export { getConfigPath, filterEnabledServers };
