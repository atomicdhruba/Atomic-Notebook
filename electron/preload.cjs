const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  minimizeWindow: () => ipcRenderer.invoke('atomic:window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('atomic:window:maximize'),
  closeWindow: () => ipcRenderer.invoke('atomic:window:close'),
  openFileDialog: () => ipcRenderer.invoke('atomic:dialog:open'),
  saveFileDialog: (defaultName) => ipcRenderer.invoke('atomic:dialog:save', defaultName),
  readFile: (filePath, encoding) => ipcRenderer.invoke('atomic:fs:read', filePath, encoding),
  writeFile: (filePath, content, encoding) => ipcRenderer.invoke('atomic:fs:write', filePath, content, encoding)
});

