const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  // Get display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Position window on right side - 1/3 of screen width for timer
  const windowWidth = Math.floor(screenWidth / 3); // 1/3 for timer
  const windowHeight = screenHeight;
  const xPosition = screenWidth - windowWidth; // Right side

  const mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: xPosition,
    y: 0,
    resizable: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    frame: true,
    title: 'Countdown Timer',
    alwaysOnTop: false, // Set to true if you want it always visible
    skipTaskbar: false
  });

  mainWindow.loadFile('index.html');

  // Optional: Open DevTools in development
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
