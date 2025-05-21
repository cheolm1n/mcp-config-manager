// Main process entry for MCP Config Manager
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { format, transports, createLogger } from 'winston';

const userData = app.getPath('userData');
const logDir = path.join(userData, 'logs');
const logPath = path.join(logDir, 'app.log');

// ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`),
  ),
  transports: [
    new transports.File({ filename: logPath }),
  ],
});

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(createWindow);

// Determine the config path. On Windows this may come from an env var or registry
// while on macOS/Linux we use the standard user config directory.
function getConfigPath(): string {
  // Allow override via environment variable
  const envPath = process.env.CLAUDE_MCP_CONFIG;
  if (envPath) {
    return envPath;
  }

  if (process.platform === 'win32') {
    // e.g. C:\Users\<user>\AppData\Roaming\ClaudeMCP\config.json
    return path.join(app.getPath('appData'), 'ClaudeMCP', 'config.json');
  }

  if (process.platform === 'darwin') {
    // ~/Library/Application Support/ClaudeMCP/config.json
    return path.join(app.getPath('home'), 'Library', 'Application Support', 'ClaudeMCP', 'config.json');
  }

  // Linux and others -> ~/.config/ClaudeMCP/config.json
  return path.join(app.getPath('home'), '.config', 'ClaudeMCP', 'config.json');
}

function readConfig() {
  const cfgPath = getConfigPath();
  if (!fs.existsSync(cfgPath)) {
    return {};
  }
  const raw = fs.readFileSync(cfgPath, 'utf-8');
  return JSON.parse(raw);
}

function writeConfig(data: any) {
  const cfgPath = getConfigPath();
  const backupPath = `${cfgPath}.${Date.now()}.bak`;
  if (fs.existsSync(cfgPath)) {
    fs.copyFileSync(cfgPath, backupPath);
  }
  fs.writeFileSync(cfgPath, JSON.stringify(data, null, 2));
}

ipcMain.handle('getConfig', async () => {
  try {
    const cfg = readConfig();
    logger.info('Config read');
    return { success: true, config: cfg };
  } catch (err: any) {
    logger.error(`getConfig error: ${err.message}`);
    return { success: false, message: err.message };
  }
});

ipcMain.handle('setConfig', async (_event, payload) => {
  try {
    const cfg = payload;
    // filter disabled servers
    if (cfg.mcpServers) {
      const filtered: Record<string, any> = {};
      Object.entries(cfg.mcpServers).forEach(([key, val]: [string, any]) => {
        if (!val || val.enabled === false) return;
        const { enabled, ...rest } = val;
        filtered[key] = rest;
      });
      cfg.mcpServers = filtered;
    }
    writeConfig(cfg);
    logger.info('Config written');
    return { success: true };
  } catch (err: any) {
    logger.error(`setConfig error: ${err.message}`);
    return { success: false, message: err.message };
  }
});

ipcMain.handle('applyConfig', async () => {
  try {
    const cliPath = process.env.CLAUDE_CLI_PATH;
    if (cliPath && fs.existsSync(cliPath)) {
      await new Promise<void>((resolve, reject) => {
        execFile(cliPath, ['reload-config'], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      logger.info('applyConfig triggered via CLI');
    } else if (mainWindow) {
      mainWindow.webContents.send('reload-mcp');
      logger.info('applyConfig message sent to renderer');
    }
    return { success: true };
  } catch (err: any) {
    logger.error(`applyConfig error: ${err.message}`);
    return { success: false, message: err.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
