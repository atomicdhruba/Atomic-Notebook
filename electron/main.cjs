const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 700,
    minHeight: 480,
    frame: false,
    backgroundColor: '#0f1117',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      spellcheck: false
    }
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    setupIpcHandlers();
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
}

function setupIpcHandlers() {
  ipcMain.handle('atomic:window:minimize', () => {
    mainWindow?.minimize();
  });

  ipcMain.handle('atomic:window:maximize', () => {
    if (!mainWindow) return false;
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
      return false;
    } else {
      mainWindow.maximize();
      return true;
    }
  });

  ipcMain.handle('atomic:window:close', () => {
    mainWindow?.close();
  });

  ipcMain.handle('atomic:dialog:open', async () => {
    if (!mainWindow) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      title: 'Open Document',
      properties: ['openFile'],
      filters: [
        { name: 'All Supported', extensions: ['md', 'markdown', 'html', 'htm', 'txt'] },
        { name: 'Markdown', extensions: ['md', 'markdown'] },
        { name: 'HTML Document', extensions: ['html', 'htm'] },
        { name: 'Plain Text', extensions: ['txt', 'log'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    if (canceled || filePaths.length === 0) return null;
    const filePath = filePaths[0];
    const content = await fs.readFile(filePath, 'utf-8');
    return { filePath, content };
  });

  ipcMain.handle('atomic:dialog:save', async (_event, defaultName) => {
    if (!mainWindow) return null;
    const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
      title: 'Save Document',
      defaultPath: defaultName || 'Untitled.md',
      filters: [
        { name: 'Markdown', extensions: ['md'] },
        { name: 'HTML Document', extensions: ['html'] },
        { name: 'Plain Text', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });
    return canceled ? null : filePath;
  });

  ipcMain.handle('atomic:fs:read', async (_event, filePath, encoding = 'utf-8') => {
    return await fs.readFile(filePath, encoding);
  });

  ipcMain.handle('atomic:fs:write', async (_event, filePath, content, encoding = 'utf-8') => {
    await fs.writeFile(filePath, content, encoding);
    return true;
  });

}
