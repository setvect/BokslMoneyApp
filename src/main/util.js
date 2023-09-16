const SALT = 10;
import path from "path";
import { format as formatUrl } from "url";
import { BrowserWindow } from "electron";
import log4js from "log4js";

const isDevelopment = process.env.NODE_ENV !== "production";
const logger = log4js.getLogger("boksl");

export default{
  newInstanceWindow() {
    let window = new BrowserWindow({
      width: 1900,
      height: 1200,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });
    logger.info(`isDevelopment: ${isDevelopment}`);
    if (isDevelopment) {
      window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
      window.setIcon(path.join(__dirname, "assets/icons/boksl-256.png"));
      window.webContents.openDevTools();
    } else {
      window.loadURL(
        formatUrl({
          pathname: path.join(__dirname, "index.html"),
          protocol: "file",
          slashes: true,
        })
      );
    }
    window.on("closed", () => {
      window = null;
    });
    return window;
  },
  makeDir(dir) {
    const fs = require("fs");
    !fs.existsSync(dir) && fs.mkdirSync(dir);
  },
  encodeBcrypt(value) {
    let bcrypt = require("bcryptjs");
    let salt = bcrypt.genSaltSync(SALT);
    let hash = bcrypt.hashSync(value, salt);
    return hash;
  },
  compareBcrypt(value, hash) {
    let bcrypt = require("bcryptjs");
    let result = bcrypt.compareSync(value, hash);
    return result;
  },
  // promise 에러 처리. 공통
  errorLog(err) {
    console.error("err :", err);
  },
};
