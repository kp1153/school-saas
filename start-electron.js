const { app, BrowserWindow, session } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = details.responseHeaders;
    if (headers["set-cookie"]) {
      headers["set-cookie"] = headers["set-cookie"].map(cookie => {
        return cookie.replace(/SameSite=Lax/gi, "SameSite=None");
      });
    }
    callback({ responseHeaders: headers });
  });

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname, "public", "icon.ico"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  mainWindow.loadURL("https://school.nishantsoftwares.in");
  mainWindow.on("closed", () => { mainWindow = null; });
}

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});