const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runCommand: (command) => ipcRenderer.invoke('run-command', command)
});