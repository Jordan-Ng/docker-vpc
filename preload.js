const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  runCommand: (command) => ipcRenderer.invoke('run-command', command),

  spawn: (commandObj) => ipcRenderer.send("spawn", commandObj),

  onOutput: (callback) => {
    if (callback) {
      ipcRenderer.on("command-output", (event,data) => callback(data))
    }
    else {
      ipcRenderer.removeAllListeners("command-output")
    }
  },

  onExit: (callback) => {
    if (callback) {
      ipcRenderer.on("child-exit", (event,data) => callback(data))
    }
    else {
      ipcRenderer.removeAllListeners("child-exit")
    }
  },

  pathJoin: (...args) => ipcRenderer.invoke("pathJoin", ...args)
});