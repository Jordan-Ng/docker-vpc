const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const isDev = true

function createWindow() {
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
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(stderr);
        } else {
          resolve(stdout);
        }
      });
    });
  });

app.on('ready', createWindow);

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
