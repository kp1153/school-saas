const { app, BrowserWindow } = require("electron");

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL("https://school.nishantsoftwares.in");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});