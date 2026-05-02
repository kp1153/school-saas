const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const http = require("http");

let mainWindow;

function waitForServer(retries, cb) {
  http.get("http://localhost:3000", (res) => cb()).on("error", () => {
    if (retries === 0) return;
    setTimeout(() => waitForServer(retries - 1, cb), 1000);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
    },
  });
  mainWindow.loadURL("http://localhost:3000");
}

app.whenReady().then(() => {
  const next = spawn("npx", ["next", "dev", "--port", "3000"], {
    shell: true,
    stdio: "inherit",
  });

  waitForServer(60, () => {
    createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});