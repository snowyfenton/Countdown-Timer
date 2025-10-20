const { app, BrowserWindow, screen } = require('electron');
const path = require('path');

function createWindow() {
  // Get display dimensions
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

  // Position window on right side (adjust x and width for left side positioning)
  const windowWidth = 600;
  const windowHeight = screenHeight;
  const xPosition = screenWidth - windowWidth; // Right side
  // For left side, use: const xPosition = 0;

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
