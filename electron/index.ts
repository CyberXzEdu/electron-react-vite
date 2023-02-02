import { app, BrowserWindow, shell, ipcMain } from "electron";
//import { release } from "node:os";
import { join } from "node:path";

process.env.DIST_ELECTRON = join(__dirname, "../");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? join(process.env.DIST_ELECTRON, "../public") : process.env.DIST;

//process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

if (process.platform === "win32") app.setAppUserModelId(app.getName());

app.on("window-all-closed", () => app.quit());

//const preload = join(__dirname, "../preload.js");
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(process.env.DIST, "index.html");

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 625,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(url);
    //mainWindow.webContents.openDevTools();
  }
  else mainWindow.loadFile(indexHtml);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}

app.on("ready", createWindow);



ipcMain.handle("message", (data) => {
  console.log(data);
});

ipcMain.handle("create-new-window", (_, code) => {
  const childWindow = new BrowserWindow({
    width: 800,
    height: 625,
    resizable: false,
    autoHideMenuBar: true,
    title: "Child " + code,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) childWindow.loadURL(`${url}#${code}`);
  
  else childWindow.loadFile(indexHtml, { hash: code });
  
});