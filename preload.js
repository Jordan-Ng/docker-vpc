const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    exec: (command) => ipcRenderer.invoke('exec', command),

    spawn: (commandObj) => ipcRenderer.send('spawn', commandObj),

    pathJoin: (...args) => ipcRenderer.invoke("pathJoin", ...args),

    pathRelative: (path) => ipcRenderer.invoke("pathRelative", path),

    kill: (pid) => {
        ipcRenderer.send("kill", pid)
    },

    // renderer subscribed events

    onSpawn: (callback) => {
        if (callback) {
            ipcRenderer.on("on-spawn", (event, data) => callback(data))
        }
        else {
        ipcRenderer.removeAllListeners("on-spawn")
        }
        // ipcRenderer.on("on-spawn", (event, data) => callback ? callback(data) : ipcRenderer.removeAllListener("on-spawn"))
    },

    onOutput: (callback) => {
        if (callback) {
            ipcRenderer.on("on-stdout", (event, data) => callback(data))
        }
        else {
         ipcRenderer.removeAllListeners("on-stdout")
        }
        // callback ? ipcRenderer.on("on-stdout", (event,data) => callback(data)) : ipcRenderer.removeAllListeners("on-stdout")
    },

    onError: (callback) => {
        if (callback) {
            ipcRenderer.on("on-stderr", (event, data) => callback(data))
        }
        else {
        ipcRenderer.removeAllListeners("on-stderr")
        }
        // callback ? ipcRenderer.on("on-stderr", (event, data) => callback(data)) : ipcRenderer.removeAllListeners("on-stderr")
    },

    onExit:  (callback) => {
        if (callback) {
            ipcRenderer.on("on-exit", (event, data) => callback(data))
        }
        else {
         ipcRenderer.removeAllListeners("on-exit")
        }
        // callback ? ipcRenderer.on("on-exit", (event,data) => callback(data)) : ipcRenderer.removeAllListeners("on-exit")
    }

})