const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const isDev = true

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
  }
  else {
      mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  
  mainWindow.webContents.openDevTools(); // Open DevTools in development mode
}

ipcMain.handle('run-command', (event, command) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => (error ? reject(stderr) : resolve({
        exitStatus: 0,        
        out : stdout
      }))      
      );
    });
});

ipcMain.on("spawn", (event, commandObj) => {
  return new Promise((resolve, reject) => {
    let childProcess = spawn(commandObj.command, commandObj.args)
    
    childProcess.on("error", err => event.sender.send("command-output", err.toString()))        
    childProcess.stdout.on("data", data => event.sender.send("command-output", data.toString()))
    childProcess.stderr.on("data", data => event.sender.send("command-output", data.toString()))

    childProcess.on("close", code => {event.sender.send("child-exit", code.toString())})        
  })
})

ipcMain.handle("pathJoin", (event, pathArgs) => {
  return path.join(__dirname, ...pathArgs)
})

app.on('ready', async () => {
  try{
    let cp = await spawn("sh" , [path.join(__dirname, "bin", "start_colima.sh")])
    cp.on("error", err => console.log("ERROR", err))
    cp.stdout.on("data", data => console.log("STDOUT", data.toString()))
    cp.stderr.on("data", data => console.log("STDERR", data.toString()))
  
    cp.on("close", code => code === 0 && createWindow())
  }
  catch(err) {
    console.log(err)
  }

  // createWindow()
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
