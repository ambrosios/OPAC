const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initDatabase } = require('./database/database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'assets/icon.png'), // Icône de la fenêtre
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile('pages/index.html');

  mainWindow.maximize();
}

app.whenReady().then(() => {
  // Initialiser la DB et charger TOUS les handlers
  initDatabase();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
