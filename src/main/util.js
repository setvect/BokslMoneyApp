const SALT = 10;
import path from "path";
import { format as formatUrl } from "url";
import { BrowserWindow } from "electron";

const isDevelopment = process.env.NODE_ENV !== "production";

export default{
  newInstanceWindow() {
    let window = new BrowserWindow({
      width: 1500,
      height: 1200,
      webPreferences: {
        nodeIntegration: true,
      },
      // 개발자 도구를 엽니다.
    });
    if (isDevelopment) {
      window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
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
    window.webContents.openDevTools();
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
