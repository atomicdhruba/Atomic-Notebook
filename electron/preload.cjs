const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  minimizeWindow: () => ipcRenderer.invoke('notchpad:window:minimize'),
  maximizeWindow: () => ipcRenderer.invoke('notchpad:window:maximize'),
  closeWindow: () => ipcRenderer.invoke('notchpad:window:close'),
  openFileDialog: () => ipcRenderer.invoke('notchpad:dialog:open'),
  saveFileDialog: (defaultName) => ipcRenderer.invoke('notchpad:dialog:save', defaultName),
  readFile: (filePath, encoding) => ipcRenderer.invoke('notchpad:fs:read', filePath, encoding),
  writeFile: (filePath, content, encoding) => ipcRenderer.invoke('notchpad:fs:write', filePath, content, encoding)
});
