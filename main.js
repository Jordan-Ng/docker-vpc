const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const process = require('process')
const util = require('util')
const isDev = true
const execAsync = util.promisify(exec)

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,      
    },
  });

  if (isDev) {    
    mainWindow.loadURL("http://localhost:3000")
    mainWindow.webContents.openDevTools(); // Open DevTools in development mode
  }
  else {
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }
}

// =============== EVENT HANDLERS ======================
ipcMain.handle("exec", async (event, command) => {  
  try{
    const data =  await execAsync(command)    
    return {
      exitStatus: 0,
      out: data.stdout
    }
  }
  catch (error){
    return {
      exitStatus: -1,
      err: error.toString()
    }
  }
})

ipcMain.on("spawn", async (event, commandObj) => {
  try {
    const childProcess = spawn(commandObj.command, commandObj.args)

    childProcess.on("error", err => event.sender.send("on-stderr", err.toString()))
    childProcess.on("spawn", () => event.sender.send("on-spawn", childProcess.pid))
    
    childProcess.stdout.on("data", data => event.sender.send("on-stdout", data.toString()))
    childProcess.stderr.on("data", err => event.sender.send("on-stderr", err.toString()))

    childProcess.on("close", code => event.sender.send("on-exit", code))
  }
  catch (err){
    console.error(err.toString())    
  }
})

ipcMain.handle("pathJoin", (event, pathArgs) => {
  return path.join(__dirname, ...pathArgs)
})

ipcMain.handle("pathRelative", (event, abspath) => {
  return path.relative(__dirname, abspath)
})

ipcMain.on("kill", (event, pid) => {
  process.kill(pid, "SIGTERM")
})


// =============== APP EVENTS ===================
app.on('ready', async () => {  
  createWindow()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
