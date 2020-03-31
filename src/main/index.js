import { app, BrowserWindow } from "electron";
import path from "path";
import { format as formatUrl } from "url";
import menu from "./menu.js";

import loginEvent from "./module/login/login-event.js";
import util from "./util.js";
import userVo from "./model/user-vo.js";
import accountVo from "./model/account-vo.js";
import categoryVo from "./model/category-vo.js";
import oftenUsedVo from "./model/oftenUsed-vo.js";
import memoVo from "./model/memo-vo.js";
import transactionVo from "./model/transaction-vo.js";
import codeMainVo from "./model/codeMain-vo.js";
import codeItemVo from "./model/codeItem-vo.js";

const isDevelopment = process.env.NODE_ENV !== "production";
console.log("isDevelopment :", isDevelopment);

// 0. 디렉토리 생성
util.makeDir("./db");

// 1. 윈도우 메뉴 초기화
menu.init();

// 2. DB 초기화
userVo
  .sync()
  .then(() => {
    return userVo.findAll();
  })
  .then(users => {
    console.log("users.length:", users.length);
    if (users.length !== 0) {
      return null;
    }
    console.log("add User");
    const hash = util.encodeBcrypt("1234");
    // 기본 사용자 등록
    return userVo.create({
      userId: "boksl",
      name: "복슬이",
      password: hash,
      deleteF: false
    });
  })
  .catch(util.errorLog);

accountVo.sync().then(() => console.log("account .."));
categoryVo.sync().then(() => console.log("category .."));
oftenUsedVo.sync().then(() => console.log("oftenUsed .."));
memoVo.sync().then(() => console.log("memo .."));
transactionVo.sync().then(() => console.log("transaction .."));
codeMainVo.sync().then(() => console.log("codeMain .."));
codeItemVo.sync().then(() => console.log("codeItem .."));

loginEvent.init();

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
