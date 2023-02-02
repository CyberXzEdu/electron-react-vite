var import_electron = require("electron");
var import_node_path = require("node:path");
process.env.DIST_ELECTRON = (0, import_node_path.join)(__dirname, "../");
process.env.DIST = (0, import_node_path.join)(process.env.DIST_ELECTRON, "../dist");
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL ? (0, import_node_path.join)(process.env.DIST_ELECTRON, "../public") : process.env.DIST;
if (process.platform === "win32")
  import_electron.app.setAppUserModelId(import_electron.app.getName());
import_electron.app.on("window-all-closed", () => import_electron.app.quit());
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = (0, import_node_path.join)(process.env.DIST, "index.html");
function createWindow() {
  const mainWindow = new import_electron.BrowserWindow({
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
  } else
    mainWindow.loadFile(indexHtml);
  mainWindow.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      import_electron.shell.openExternal(url2);
    return { action: "deny" };
  });
}
import_electron.app.on("ready", createWindow);
import_electron.ipcMain.handle("message", (data) => {
  console.log(data);
});
import_electron.ipcMain.handle("create-new-window", (_, code) => {
  const childWindow = new import_electron.BrowserWindow({
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
  if (process.env.VITE_DEV_SERVER_URL)
    childWindow.loadURL(`${url}#${code}`);
  else
    childWindow.loadFile(indexHtml, { hash: code });
});

//# sourceMappingURL=index.js.map