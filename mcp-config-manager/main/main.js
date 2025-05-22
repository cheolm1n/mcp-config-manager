const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises; // Using promises version of fs
const os = require('os');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let currentConfigPath = ''; // Ensure this is at a scope accessible by IPC handlers

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Vite dev server URL or index.html path
  if (process.env.ELECTRON_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_VITE_DEV_SERVER_URL);
    // Open DevTools only in development
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- IPC Handlers (to be expanded in later steps) ---

// Function to get default MCP config path based on OS
function getDefaultMcpPath() {
    // Make sure this returns null or a string
    let MPath;
    switch (process.platform) {
      case 'win32':
        MPath = path.join(app.getPath('appData'), 'ClaudeDesktop', 'mcp.json');
        break;
      case 'darwin': // macOS
        MPath = path.join(app.getPath('home'), 'Library', 'Application Support', 'ClaudeDesktop', 'mcp.json');
        break;
      case 'linux':
        MPath = path.join(app.getPath('home'), '.config', 'ClaudeDesktop', 'mcp.json');
        break;
      default:
        console.error('Unsupported platform for default MCP path');
        return null;
    }
    // Ensure parent directory exists
    // const parentDir = path.dirname(MPath);
    // try {
    //   fs.mkdir(parentDir, { recursive: true }); // This is synchronous, for async use await fs.mkdir
    // } catch (e) {
    //    console.error(`Failed to create directory ${parentDir}`, e); // This could be an issue if it does not exist
    // }
    return MPath;
}

ipcMain.handle('config:read', async (_event, filePath) => {
  const targetPath = filePath || getDefaultMcpPath();
  if (!targetPath) {
    const errorMsg = '운영 체제 기본 경로를 결정할 수 없거나 지원되지 않는 플랫폼입니다.';
    console.error(errorMsg);
    // It's better to send errors via the same channel if the renderer expects a response,
    // or use a dedicated error event if it's fire-and-forget.
    // Since preload expects onConfigError, we'll use that.
    mainWindow.webContents.send('config:error', errorMsg);
    return; // Important to return here
  }

  console.log(`Attempting to read config from: ${targetPath}`);
  try {
    // Ensure parent directory of targetPath exists, especially for default path on first run
    const parentDir = path.dirname(targetPath);
    await fs.mkdir(parentDir, { recursive: true }); // Asynchronously create directory

    const data = await fs.readFile(targetPath, 'utf8');
    const config = JSON.parse(data);
    currentConfigPath = targetPath; // Update currentConfigPath
    console.log(`Config loaded successfully from ${currentConfigPath}`);
    mainWindow.webContents.send('config:loaded', { config, filePath: currentConfigPath });
  } catch (error) {
    currentConfigPath = ''; // Reset path on error
    let userMessage = `설정 파일 (${targetPath}) 로드 실패: `;
    if (error.code === 'ENOENT') {
      userMessage += '파일을 찾을 수 없습니다. 기본 경로에 빈 설정 파일을 생성하거나 "열기"로 파일을 선택하세요.';
      // Optionally, create an empty mcp.json here if it's ENOENT on default path
      if (targetPath === getDefaultMcpPath()) {
         try {
           await fs.writeFile(targetPath, '[]', 'utf8');
           console.log(`Created empty default config file at ${targetPath}`);
           currentConfigPath = targetPath;
           mainWindow.webContents.send('config:loaded', { config: [], filePath: currentConfigPath });
           return;
         } catch (writeError) {
           console.error(`Failed to create empty default config: ${writeError}`);
           userMessage += ` 기본 설정 파일 생성 시도 실패: ${writeError.message}`;
         }
      }
    } else if (error instanceof SyntaxError) {
      userMessage += 'JSON 형식이 올바르지 않습니다.';
    } else {
      userMessage += error.message;
    }
    console.error('Error reading config file:', error);
    mainWindow.webContents.send('config:error', userMessage);
  }
});

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'MCP 설정 파일 선택',
    properties: ['openFile'],
    filters: [{ name: 'JSON Files', extensions: ['json'] }],
  });
  if (canceled || filePaths.length === 0) {
    return null;
  }
  // After selecting a file, trigger config:read with the new path
  // The config:read handler will then send config:loaded or config:error
  // No need to directly send from here.
  // Store it so 'Sync' knows where to save.
  // currentConfigPath = filePaths[0]; // This will be set by the config:read handler
  return filePaths[0]; // Return the path to renderer, which will call configRead
});

ipcMain.handle('config:sync', async (_event, activeMcpsToSync) => {
  if (!currentConfigPath) {
    throw new Error('설정 파일 경로가 지정되지 않았습니다. 먼저 파일을 로드하거나 선택하세요.');
  }
  if (!activeMcpsToSync || !Array.isArray(activeMcpsToSync)) {
     throw new Error('동기화할 데이터가 유효하지 않습니다.');
  }

  console.log(`Syncing ${activeMcpsToSync.length} MCPs to ${currentConfigPath}`);

  try {
    // 1. Create backup (if original file exists)
    const backupDir = path.dirname(currentConfigPath);
    const originalFileName = path.basename(currentConfigPath);
    // YYYYMMDDHHmmss, removes colons, periods, T, Z
    const timestamp = new Date().toISOString().replace(/[:.TZ-]/g, '').slice(0, 14);
    const backupFileName = `${originalFileName.replace(/\.json$/i, '')}.backup_${timestamp}.json`;
    const backupFilePath = path.join(backupDir, backupFileName);

    try {
      // Check if source file exists before trying to copy
      await fs.access(currentConfigPath); // Throws if doesn't exist
      await fs.copyFile(currentConfigPath, backupFilePath);
      console.log(`Backup created at ${backupFilePath}`);
    } catch (accessError) {
      // If currentConfigPath doesn't exist (e.g. first save to a new file), skip backup.
      console.log(`Original file ${currentConfigPath} does not exist. Skipping backup.`);
    }
    
    // 2. Write filtered data to original path
    await fs.writeFile(currentConfigPath, JSON.stringify(activeMcpsToSync, null, 2), 'utf8');
    console.log(`Successfully synced ${activeMcpsToSync.length} MCPs to ${currentConfigPath}`);
    
    return activeMcpsToSync.length; // Return count of synced items

  } catch (error) {
    console.error(`Sync error: ${error.message}`);
    throw new Error(`동기화 실패: ${error.message}`); // Rethrow customized error
  }
});

// --- End of main/main.js
