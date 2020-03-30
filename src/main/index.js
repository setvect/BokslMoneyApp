import { app, BrowserWindow } from "electron";
import path from "path";
import { format as formatUrl } from "url";
import menu from "./menu.js";

const isDevelopment = process.env.NODE_ENV !== "production";
console.log("isDevelopment :", isDevelopment);
menu.init();

app.on("ready", () => {
  let window = new BrowserWindow({
    width: 1024,
    webPreferences: {
      nodeIntegration: true
    }
    // 개발자 도구를 엽니다.
  });
  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true
      })
    );
  }
  window.on("closed", () => {
    window = null;
  });
  window.webContents.openDevTools();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
