const { spawn } = require("child_process");
const http = require("http");

function waitForServer(retries, cb) {
  http.get("http://localhost:3000", () => cb()).on("error", () => {
    if (retries === 0) return;
    setTimeout(() => waitForServer(retries - 1, cb), 1000);
  });
}

const next = spawn("npx", ["next", "dev", "--port", "3000"], {
  shell: true,
  stdio: "inherit",
});

setTimeout(() => {
  waitForServer(30, () => {
    const { app, BrowserWindow } = require("electron");
    app.whenReady().then(() => {
      const win = new BrowserWindow({ width: 1280, height: 800 });
      win.loadURL("http://localhost:3000");
    });
  });
}, 3000);