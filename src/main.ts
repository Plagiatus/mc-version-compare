import { BrowserWindow, app } from "electron";

app.whenReady().then(createWindow);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile("src/index.html");
    // win.maximize();
}

app.on("window-all-closed", () => { if (process.platform !== "darwin") { app.quit() } });
app.on("activate", () => { if (BrowserWindow.getAllWindows().length == 0) createWindow(); })